import React, { useEffect, useState } from 'react';
import { Link, useLocation  } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import { SidebarData } from './SideBarData';
import styled from 'styled-components';
import { IconBaseProps } from 'react-icons';
import { url } from 'inspector';

const Div = styled.div`
  width: 2rem;
  position: fixed;
  justify-content: start;
  margin-top: 0.6rem;
  height: 2rem;
  background-color: #000080;
  border-bottom-right-radius: 50%;
  border-top-right-radius: 50%;
  top: 0;
  left: 0;
`;

const MenuIconOpen = styled(Link)`
position: fixed;
font-size: 1.5rem;
margin-top: 0.75rem;
margin-right: 10rem;
color: #E5E7EB;
top: 0;
left: 0;
`;

const MenuIconClose = styled(Link)`
  display: flex;
  justify-content: end;
  font-size: 1.5rem;
  margin-top: 0.75rem;
  margin-right: 1rem;
  color: #ffffff;
`;


const SidebarMenu = styled.div<{ close: boolean}>`
  width: 250px;
  height: 100vh;
  background-color: #000080;
  position: fixed;
  top: 0;
  left: ${({ close}) => ((close) ? '0' : '-100%')};
  transition: 0.6s;

  @media screen and (max-width: 768px) {
    width: 80%;
  }
`;

const MenuItems = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: start;
  width: 100%;
  height: 90px;
  padding: 1rem 0 1.25rem;
`;

const MenuItemLinks = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0 2rem;
  font-size: 20px;
  text-decoration: none;
  color: #ffffff;

  &:hover {
    background-color: #ffffff;
    color: #000080;
    width: 100%;
    height: 45px;
    text-align: center;
    border-radius: 5px;
    margin: 0 2rem;
  }
`;

const Sidebar: React.FunctionComponent = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <>
      <Div>
        {!isOpen &&<MenuIconOpen to="#" onClick={toggleSidebar}>
          <FaIcons.FaBars />
        </MenuIconOpen> }
      </Div>
      <SidebarMenu close={isOpen}>
        <MenuIconClose to="#" onClick={toggleSidebar}>
          <FaIcons.FaTimes />
        </MenuIconClose>

        <ul className="menu-items">
          {SidebarData.map((item, index) => {
            return (
              <MenuItems key={index}>
                <MenuItemLinks to={item.path}>
                  {item.icon}
                  <span style={{ marginLeft: '16px' }}>{item.title}</span>
                </MenuItemLinks>
              </MenuItems>
            );
          })}
        </ul>
      </SidebarMenu>
    </>
  );
};

export default Sidebar;
