import logo from './logo.svg';
import './Header.css';
import event from './event';

const Header = () => {
  return (
    <div className='container'>
      <header className='header'>
        <img src={logo} className='logo' alt='logo' />
        <h1 className='title'>{event.name}</h1>
        <span className='organizer'>
          主辦單位：{event.organizers.join('、')}
        </span>
        <br />
        <span className='implementer'>
          執行單位：{event.implementers.join('、')}
        </span>
      </header>
    </div>
  );
};

export default Header;
