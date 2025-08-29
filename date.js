      const today = new Date();
      const month = today.getMonth() + 1; // getMonth() 回傳 0-11
      const day = today.getDate();
      const weekday = today.toLocaleDateString('zh-TW', { weekday: 'long' });
      const dateStr = `${month}月${day}日 ${weekday}`;

      document.getElementById("date-todayheading").textContent = dateStr;