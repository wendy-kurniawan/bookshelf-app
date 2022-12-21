const tabList = document.querySelector('.tablist');
const tabPanels = document.querySelectorAll('.tabpanel');

tabList.addEventListener('click', event => {
    const element = event.target;
    if (element.className.includes('tablist-tab')) {
        tabList
            .querySelectorAll('.tablist-tab')
            .forEach(t => t.classList.remove('tablist-tab-is-active'));
        element.classList.add('tablist-tab-is-active');

        const controlledPanel = element.getAttribute('aria-controls');
        const targetPanel = document.getElementById(controlledPanel);
        tabPanels.forEach(t => t.classList.remove('tabpanel-is-active'));
        targetPanel.classList.add('tabpanel-is-active');
    }
});
