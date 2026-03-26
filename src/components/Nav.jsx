// Navigation bar — highlighted tab shows the current page

const navItems = [
  { id: 'home',       label: 'Home',       icon: '/icons/Homepage.png'   },
  { id: 'collection', label: 'Collection', icon: '/icons/Collection.png' },
  { id: 'log-catch',  label: 'Log Catch',  icon: '/icons/add.png'        },
  { id: 'stats',      label: 'Stats',      icon: '/icons/stats.png'      },
]

function Nav({ page, navigate }) {
  return (
    <nav className="nav">
      {navItems.map(item => (
        <button
          key={item.id}
          className={`nav-btn ${page === item.id ? 'nav-btn--active' : ''}`}
          onClick={() => navigate(item.id)}
        >
          <img src={item.icon} alt={item.label} className="nav-icon-img" />
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default Nav
