import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <ul className="footer__categories">
        <li><Link  to="/posts/categories/Agriculture">Agriculture</Link></li>
        <li><Link  to="/posts/categories/Art">Art</Link></li>
        <li><Link  to="/posts/categories/Tech"  >Tech</Link></li>
        <li><Link  to="/posts/categories/Ai&ml"  >Ai&ml</Link></li>
        <li><Link  to="/posts/categories/Food"  >Food</Link></li>
        <li><Link  to="/posts/categories/History"  >History</Link></li>
        <li><Link  to="/posts/categories/Webdev"  >Webdev</Link></li>
        <li><Link  to="/posts/categories/Investment"  >Investment</Link></li>
        <li><Link  to="/posts/categories/Weather"  >Weather</Link></li>
      </ul>
      <div className="footer__copyright">
        <small>All Right Reserved &copy; Copyright, Mahendra Jakhar. </small>
      </div>
    </footer>
  )
}

export default Footer