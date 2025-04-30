import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

const useCheckLoginUrl = () => {
  const router = useRouter();
  const { login_url: queryLoginUrl } = router.query;

  useEffect(() => {
    if (router.isReady) {
      const cookieLoginUrl = Cookies.get('login_url');
      
      if (!queryLoginUrl && !cookieLoginUrl) {
        return;
      }
      
      if (queryLoginUrl && queryLoginUrl !== cookieLoginUrl) {
        router.replace('/404');
        return;
      }
    }
  }, [router.isReady, queryLoginUrl]);

  return queryLoginUrl;
};

export default useCheckLoginUrl;