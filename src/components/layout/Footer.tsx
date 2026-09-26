import { Link } from 'react-router-dom';
import { brand } from '../../config/brand';
export default function Footer(){return <footer className="footer"><div><Link to="/" className="brand"><img src={brand.logo} alt=""/><span>{brand.name}</span></Link><p>{brand.subtitle}</p></div><div className="footer-links"><Link to="/atlas/body">The atlas</Link><Link to="/systems">Body systems</Link><Link to="/about">About this atlas</Link></div><small>Powered By {brand.company}<br/>Educational visualization · 3D anatomy workspace</small></footer>}
