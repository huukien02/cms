import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Styled from 'styled-components';

const TabContainer = Styled.div`
  display: flex;
  justify-content: start;
  padding: 10px;
  border-bottom: 1px solid #dadadd;
  margin-bottom: 30px;
  padding-bottom: 8px;

  a {
    padding: 12px;
    &.active {
      border-bottom: 2px solid #4a79f7;
    }
  }
`;

const TabContent = Styled.div`
`

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  const router = useRouter();
  const isActive = router.asPath.startsWith(href);

  return (
    <Link href={href} className={isActive ? 'active' : ''}>{children}
    </Link>
  );
};

const UsersTab: React.FC = () => {
  return (
    <TabContainer>
      <TabContent><NavLink href="/users/account">アカウント</NavLink></TabContent>
      <TabContent><NavLink href="/users/history">ログイン履歴</NavLink></TabContent>
    </TabContainer>
  );
};

export default UsersTab;
