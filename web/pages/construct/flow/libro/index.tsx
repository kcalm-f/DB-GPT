import { ChatContext } from '@/app/chat-context';
import { useSearchParams } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Libro: React.FC = () => {
  const searchParams = useSearchParams();
  const { i18n } = useTranslation();
  const { mode } = useContext(ChatContext);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const id = searchParams?.get('id') || '';
  const [libroServerOrigin, setLibroServerOrigin] = useState('');

  useEffect(() => {
    setLibroServerOrigin(
      `${window.location.protocol}//${window.location.hostname}:${process.env.NEXT_PUBLIC_LIBRO_SERVER_PORT || '5671'}`,
    );
    console.log(window.location);
    // 监听语言切换事件
    const handleLanguageChange = (lng: string) => {
      if (libroServerOrigin) {
        iframeRef.current?.contentWindow?.postMessage(`lang:${lng}`, libroServerOrigin);
      }
    };

    // 注册监听器
    i18n.on('languageChanged', handleLanguageChange);

    // 清理监听器
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n, libroServerOrigin]);

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(`theme:${mode}`, libroServerOrigin);
  }, [mode]);

  return (
    <>
      {libroServerOrigin && (
        <iframe
          src={`${libroServerOrigin}/dbgpt?flow_uid=${id}`}
          className='h-full'
          ref={iframeRef}
        ></iframe>
      )}
    </>
  );
};

export default Libro;
