
      function switchMysticTab(tabId, btnTarget) {
        const container = btnTarget.closest('.mystic-tabs-wrapper');
        container.querySelectorAll('.mystic-tab-content').forEach(el => el.classList.remove('active'));
        container.querySelectorAll('.mystic-tab-btn').forEach(el => el.classList.remove('active'));
        
        document.getElementById(tabId).classList.add('active');
        btnTarget.classList.add('active');
      }
    