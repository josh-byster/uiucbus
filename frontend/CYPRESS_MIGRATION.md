# Cypress Test Migration Guide

## Selector Mapping (Old → New)

### HomePage
- `.info-box` → `[data-testid="page-title"]`

### StopSearch
- `.react-autosuggest__input` → `[data-testid="stop-search-input"]`
- `.react-autosuggest__suggestions-list` → `[data-testid="stop-search-suggestions"]`
- Individual suggestions → `[data-testid="stop-search-option"]`

### BusNavbar
- `.navbar-brand` → `[data-testid="navbar-home-link"]`
- `.nav-item` → `[data-testid="nav-stop-link"]`
- `.dropdown-toggle` → `[data-testid="recents-dropdown-toggle"]`
- `.dropdown-menu` → `[data-testid="recents-dropdown-menu"]`
- Dropdown items → `[data-testid="recents-dropdown-item"]`
- Clear All button → `[data-testid="recents-clear-all"]`

### TrackingPage
- `.stop_name` → `[data-testid="stop-name"]`
- Bus result rows → `[data-testid="bus-result-row"]` (needs to be added)
- Modal title → `[data-testid="bus-modal-title"]` (needs to be added)
- Modal image → `[data-testid="bus-modal-image"]` (needs to be added)

### Notes
- Headless UI Combobox handles keyboard navigation automatically
- Use `.should('be.visible')` carefully as Headless UI manages visibility dynamically
- Modal structure changed from Bootstrap to Headless UI Dialog
