import { logout } from '../../lib/api';
import { HOME_ROUTE } from '../../router';
import { useUserStore } from '../../store/user_store';

export default function Header() {
  const { user, clearUser } = useUserStore();
  const handleLogout = async () => {
    console.log('Logging out user...');
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearUser();
    }
    window.location.href = '/';
  };

  const menu = [
    {
      name: 'Home',
      link: HOME_ROUTE,
    },
    // {
    //   name: 'Dashboards',
    //   link: '/dashboards',
    // },
    {
      name: 'Tools',
      link: '',
      subMenu: [
        {
          name: 'Generate Data',
          link: '/generate-data',
        },
        {
          name: 'Load Remote Data',
          link: '/load-data',
        },
        {
          name: 'Check GeoJSon File',
          link: '/geo',
        },
      ],
    },
  ];

  return (
    <div className='navbar bg-primary text-primary-content shadow-xl mb-2'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <div tabIndex={0} role='button' className='btn btn-ghost lg:hidden'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h8m-8 6h16'
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className='menu menu-sm dropdown-content bg-base-100 text-primary rounded-box z-[1] mt-3 w-52 p-2 shadow'
          >
            {menu.map((item, index) => {
              if (item.subMenu) {
                return (
                  <li key={`mobile-${item.name}`}>
                    <a>{item.name}</a>
                    <ul className='p-2'>
                      {item.subMenu.map((subItem, subIndex) => {
                        return (
                          <li key={`mobile-sub-${subItem.name}`}>
                            <a href={subItem.link}>{subItem.name}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              } else {
                return (
                  <li key={`mobile-${item.name}`}>
                    <a href={item.link}>{item.name}</a>
                  </li>
                );
              }
            })}
          </ul>
        </div>
        <a className='btn btn-ghost text-xl' href='/'>
          Dataviz
        </a>
      </div>
      <div className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal px-1 bg-base text-content'>
          {menu.map((item, index) => {
            if (item.subMenu) {
              return (
                <li key={`menu-${item.name}`}>
                  <details>
                    <summary>{item.name}</summary>
                    <ul className='min-w-[160px] bg-base-100 text-primary z-10'>
                      {item.subMenu.map((subItem, subIndex) => {
                        return (
                          <li
                            key={`menu-sub-${subItem.name}`}
                            className='bg-base-100 text-primary'
                          >
                            <a href={subItem.link}>{subItem.name}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                </li>
              );
            } else {
              return (
                <li key={`menu-${item.name}`}>
                  <a href={item.link}>{item.name}</a>
                </li>
              );
            }
          })}
        </ul>
      </div>
      <div className='navbar-end px-4'>
        {user ? (
          <div>
            <span className='px-2'>
              <button
                className='btn btn-default btn-sm'
                onClick={() => handleLogout()}
              >
                logout
              </button>
              {/* <span className='px-2'>{user.name}</span> */}
            </span>
          </div>
        ) : (
          <a href='/login' className='btn btn-ghost btn-sm'>
            Login
          </a>
        )}
      </div>
    </div>
  );
}
