
$(document).ready(async () => {
  frappe.call({
    method: 'my_rmc.api.theme.get_theme_settings',
    callback: (response) => {
      const theme_settings = response.message;
      const root = document.documentElement;

      if (theme_settings.main_background) {
        root.style.setProperty('--main-bg-color', theme_settings.main_background);
      }

      if (theme_settings.primary_color) {
        root.style.setProperty('--primary', theme_settings.primary_color);
        root.style.setProperty('--btn-primary', theme_settings.primary_color);
        root.style.setProperty('--btn-primary1', theme_settings.primary_color);
      }

      const loginPage = document.getElementById('page-login');
      if (loginPage) {
        if (theme_settings.splash_image) {
          // loginPage.style.backgroundImage = "url('" + website_settings.splash_image + "')";
          // loginPage.style.backgroundSize = "cover";
          // loginPage.style.backgroundPosition = "center";
          // loginPage.style.backgroundRepeat = "no-repeat";
        }
      }
    }
  });
});