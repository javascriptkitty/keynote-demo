import logo from '../../assets/img/pepsico-logo.svg';
import chevronIcon from '../../assets/img/chevron.svg';
import globeIcon from '../../assets/img/globe.svg';
import searchIcon from '../../assets/img/search.svg';
import './index.css';

const navItems = [
    { label: 'Who We Are', hasArrow: true },
    { label: 'Our Impact', hasArrow: true },
    { label: 'Our Brands', hasArrow: false },
    { label: 'Our Stories', hasArrow: false },
    { label: 'Resources', hasArrow: true },
];

const Header = () => {
    return (
        <header className="header">
            <div className="header__content">
                <div className="header__content_menu">
                    <img src={logo} width={104} alt="Logo" />

                    <nav className="header__nav">
                        {navItems.map((item) => (
                            <button type="button" key={item.label} className="header__nav-item">
                                {item.label}
                                {item.hasArrow && <img src={chevronIcon} className="header__chevron" alt="Chevron" />}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="header__actions">
                    <button type="button">Contact</button>

                    <button type="button" className="header__location">
                        <img src={globeIcon} width={14} alt="Globe" />
                        United Kingdom
                    </button>
                    <button type="button">
                        <img src={searchIcon} width={16} alt="Search" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
