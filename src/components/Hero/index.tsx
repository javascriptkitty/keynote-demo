import strokesIcon from '../../assets/img/strokes.svg';
import arrowIcon from '../../assets/img/arrow.svg';
import pepsicoBg from '../../assets/img/pepsico-bg.png';
import './index.css';

const Hero = () => {
    return (
        <section className="hero" style={{ backgroundImage: `url(${pepsicoBg})` }}>
            <div className="hero__content">
                <img src={arrowIcon} className="hero_icon icon_arrow" />
                <h1>Create more smiles with every sip and every bite</h1>
                <img src={strokesIcon} className="hero_icon icon_strokes" />
            </div>
        </section>
    );
};

export default Hero;
