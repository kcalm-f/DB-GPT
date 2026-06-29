#!/usr/bin/env python3
"""Load BIRD text2sql dev dataset into DB-GPT.

Two modes:
  A. Register each BIRD database (dev_databases/<db_id>/<db_id>.sqlite)
     as a separate datasource. You manually pick one in the Chat UI when
     asking questions.

  B. Merge all 12 BIRD databases into one big SQLite (all 75 tables are
     uniquely named so no conflicts), register that single merged file as
     one datasource. You can then ask any question without switching.

Usage:
  python scripts/load_bird_dataset.py --mode A --bird-dir /path/to/dev_20240627
  python scripts/load_bird_dataset.py --mode B --bird-dir /path/to/dev_20240627

Prerequisites:
  DB-GPT server must be running (default http://127.0.0.1:5670).
  Override with --api-base if different.
"""

import argparse
import json
import os
import sqlite3
import sys
from pathlib import Path
from typing import List, Tuple

import requests

DEFAULT_API_BASE = "http://127.0.0.1:5670"
DEFAULT_BIRD_DIR = (
    "/Users/kcalm/Documents/01工作/02-实验室项目/07-取数问数/"
    "02-eval-data/text2sql/dev_20240627"
)
DEFAULT_MERGED_DB = "pilot/benchmark_meta_data/bird_merged.sqlite"


# ---------------------------------------------------------------------------
# Discovery
# ---------------------------------------------------------------------------

def discover_bird_databases(bird_dir: Path) -> List[Tuple[str, Path]]:
    """Return list of (db_id, sqlite_path) under dev_databases/."""
    dev_db_dir = bird_dir / "dev_databases"
    if not dev_db_dir.exists():
        raise FileNotFoundError(f"dev_databases/ not found under {bird_dir}")

    result = []
    for sub in sorted(dev_db_dir.iterdir()):
        if not sub.is_dir():
            continue
        candidates = list(sub.glob("*.sqlite")) + list(sub.glob("*.db"))
        # Skip empty dev.db in root if it leaked here
        candidates = [c for c in candidates if c.stat().st_size > 0]
        if not candidates:
            print(f"  [skip] {sub.name}: no sqlite file")
            continue
        result.append((sub.name, candidates[0]))
    return result


# ---------------------------------------------------------------------------
# Option A - register each as separate datasource
# ---------------------------------------------------------------------------

def register_datasource(api_base: str, db_name: str, db_path: str,
                        description: str = "") -> dict:
    """POST /api/v2/serve/datasources to register a SQLite datasource."""
    url = f"{api_base.rstrip('/')}/api/v2/serve/datasources"
    payload = {
        "type": "sqlite",
        "params": {"path": str(db_path)},
        "description": description or f"BIRD database: {db_name}",
    }
    r = requests.post(url, json=payload, timeout=30)
    r.raise_for_status()
    body = r.json()
    if not body.get("success"):
        raise RuntimeError(f"Register failed for {db_name}: {body}")
    return body.get("data", {})


def option_a_register_all(api_base: str, bird_dir: Path) -> None:
    dbs = discover_bird_databases(bird_dir)
    print(f"\n[Option A] Registering {len(dbs)} BIRD databases individually...")
    for db_id, db_path in dbs:
        try:
            info = register_datasource(
                api_base,
                db_name=db_id,
                db_path=str(db_path.resolve()),
                description=f"BIRD dev - {db_id}",
            )
            print(f"  [ok]   {db_id:25s} -> id={info.get('id')}  ({db_path})")
        except Exception as e:
            print(f"  [fail] {db_id:25s} -> {e}")
    print("\nDone. In Chat UI, pick the matching BIRD datasource before asking.")


# ---------------------------------------------------------------------------
# Option B - merge all databases into one, then register
# ---------------------------------------------------------------------------

def merge_bird_databases(dbs: List[Tuple[str, Path]], out_path: Path) -> None:
    """Merge all BIRD sqlite files into one database.

    Strategy: for each source database, ATTACH it under a unique alias,
    CREATE each table in main, INSERT data, COMMIT, then DETACH. This
    releases any read locks before the next ATTACH.
    """
    if out_path.exists():
        out_path.unlink()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    dst = sqlite3.connect(out_path)
    # Let sqlite3 manage transactions (default isolation_level="")
    # We only do explicit COMMIT right before DETACH to release the read lock.
    cur = dst.cursor()

    total_tables = 0
    for db_id, src_path in dbs:
        alias = f"src_{db_id}"

        # Commit any pending transaction before ATTACH
        try:
            dst.commit()
        except sqlite3.OperationalError:
            pass  # no active transaction
        cur.execute(f"ATTACH DATABASE ? AS [{alias}]", (str(src_path.resolve()),))
        try:
            tables = cur.execute(
                f'SELECT name, sql FROM [{alias}].sqlite_master '
                f"WHERE type='table' AND name NOT LIKE 'sqlite_%'"
            ).fetchall()

            for tbl_name, create_sql in tables:
                # Skip if target already has this table
                exists = cur.execute(
                    "SELECT 1 FROM sqlite_master "
                    "WHERE type='table' AND name=?",
                    (tbl_name,),
                ).fetchone()
                if exists:
                    print(f"  [dup] {tbl_name} already in merged db, skipping")
                    continue

                cur.execute(create_sql)

                row_count = cur.execute(
                    f'SELECT COUNT(*) FROM [{alias}].[{tbl_name}]'
                ).fetchone()[0]
                if row_count > 0:
                    cur.execute(
                        f'INSERT INTO main.[{tbl_name}] '
                        f'SELECT * FROM [{alias}].[{tbl_name}]'
                    )
                total_tables += 1
                print(f"  + {db_id}.{tbl_name} ({row_count} rows)")

            # Commit before DETACH so the source is not held locked
            dst.commit()
        finally:
            try:
                cur.execute(f"DETACH DATABASE [{alias}]")
            except sqlite3.OperationalError as e:
                print(f"  [warn] detach {alias}: {e}")

    dst.commit()
    dst.close()

    print(f"\nMerged {total_tables} tables into {out_path}")


def option_b_merge_and_register(api_base: str, bird_dir: Path,
                                merged_path: Path) -> None:
    dbs = discover_bird_databases(bird_dir)
    print(f"\n[Option B] Merging {len(dbs)} BIRD databases into {merged_path}...")
    merge_bird_databases(dbs, merged_path)

    print(f"\nRegistering merged database as a single datasource...")
    try:
        info = register_datasource(
            api_base,
            db_name="bird_merged",
            db_path=str(merged_path.resolve()),
            description="BIRD dev - all 12 databases merged (75 tables)",
        )
        print(f"  [ok] bird_merged -> id={info.get('id')}  ({merged_path})")
    except Exception as e:
        print(f"  [fail] {e}")
        sys.exit(1)

    print("\nDone. You can now ask any BIRD question without switching datasource.")
    print(f"Total tables available: ", end="")
    conn = sqlite3.connect(merged_path)
    n = conn.execute("SELECT COUNT(*) FROM sqlite_master WHERE type='table'").fetchone()[0]
    conn.close()
    print(n)


# ---------------------------------------------------------------------------
# Smoke test: verify registered datasource is reachable
# ---------------------------------------------------------------------------

def smoke_test(api_base: str) -> None:
    """List datasources to confirm registration."""
    url = f"{api_base.rstrip('/')}/api/v2/serve/datasources"
    r = requests.get(url, timeout=15)
    r.raise_for_status()
    body = r.json()
    if not body.get("success"):
        print(f"  list failed: {body}")
        return
    items = body.get("data", [])
    bird_items = [i for i in items if "bird" in (i.get("description") or "").lower()
                  or "bird" in (i.get("db_name") or "").lower()]
    print(f"\nRegistered BIRD datasource(s): {len(bird_items)}")
    for i in bird_items:
        print(f"  - id={i.get('id')}  name={i.get('db_name')}  "
              f"desc={i.get('description')}  type={i.get('type')}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Load BIRD dataset into DB-GPT")
    parser.add_argument("--mode", choices=["A", "B", "both"], default="both",
                        help="A=per-db, B=merged, both=do both")
    parser.add_argument("--bird-dir", default=DEFAULT_BIRD_DIR,
                        help="Path to BIRD dev_20240627 directory")
    parser.add_argument("--merged-db", default=DEFAULT_MERGED_DB,
                        help="Output path for merged SQLite (mode B)")
    parser.add_argument("--api-base", default=DEFAULT_API_BASE,
                        help="DB-GPT server base URL")
    parser.add_argument("--skip-smoke-test", action="store_true",
                        help="Skip listing datasources at the end")
    args = parser.parse_args()

    bird_dir = Path(args.bird_dir).expanduser().resolve()
    if not bird_dir.exists():
        print(f"BIRD dir not found: {bird_dir}")
        sys.exit(1)

    print(f"BIRD dir : {bird_dir}")
    print(f"API base : {args.api_base}")
    print(f"Mode     : {args.mode}")

    # Verify server is reachable
    try:
        r = requests.get(f"{args.api_base}/api/health", timeout=5)
        print(f"Server   : up ({r.status_code})")
    except Exception as e:
        print(f"\n[warn] Cannot reach DB-GPT server at {args.api_base}: {e}")
        print("        Start it first with: python dbgpt/app/dbgpt_server.py")
        resp = input("Continue anyway? [y/N] ").strip().lower()
        if resp != "y":
            sys.exit(0)

    if args.mode in ("A", "both"):
        option_a_register_all(args.api_base, bird_dir)
    if args.mode in ("B", "both"):
        option_b_merge_and_register(
            args.api_base, bird_dir, Path(args.merged_db))

    if not args.skip_smoke_test:
        smoke_test(args.api_base)


if __name__ == "__main__":
    main()
