frappe.provide("frappe.search");

$(document).ready(async () => {

  frappe.call({
    method: 'my_rmc.api.theme.get_theme_settings',
    callback: (response) => {
      const theme_settings = response.message;
      const root = document.documentElement;

      if (theme_settings.site_logo) {
        const siteLogo = document.getElementById("site_logo");
        siteLogo.src = theme_settings.site_logo
      }

      if (theme_settings.primary_color) {
        root.style.setProperty('--sidebar-bg-color', theme_settings.primary_color);
      }
      if (theme_settings.button_primary_color) {
        root.style.setProperty('--primary', theme_settings.button_primary_color);
        root.style.setProperty('--btn-primary', theme_settings.button_primary_color);
        root.style.setProperty('--btn-primary1', theme_settings.button_primary_color);
      }
    }
  });

  $('.side-menu__content').on('mouseenter', function () {
    $('#nxt_sidebar').addClass('side-menu--on-hover');
  }).on('mouseleave', function () {
    $('#nxt_sidebar').removeClass('side-menu--on-hover');
  });

  var toggleMenu = localStorage.getItem('toggle-menu');
  if (toggleMenu && toggleMenu === "true") {
    $('#nxt_sidebar').toggleClass('side-menu--collapsed');
    $('.content').toggleClass('content--compact');
  }

  $('.toggle-compact-menu').click(function () {
    $('#nxt_sidebar').toggleClass('side-menu--collapsed');
    $('.content').toggleClass('content--compact');
    var toggleMenu = localStorage.getItem('toggle-menu');
    if (toggleMenu && toggleMenu === "true") {
      localStorage.setItem('toggle-menu', 'false');
    } else {
      localStorage.setItem('toggle-menu', 'true');
    }
  });

  $('.open-mobile-menu').click(function () {
    $('#nxt_sidebar').addClass('side-menu--mobile-menu-open');
    $('.close-mobile-menu').addClass('close-mobile-menu--mobile-menu-open');
  });

  $('.close-mobile-menu').click(function () {
    $('#nxt_sidebar').removeClass('side-menu--mobile-menu-open');
    $('.close-mobile-menu').removeClass('close-mobile-menu--mobile-menu-open');
  });


  $('#notification_bell').click(function () {
    $('#notifications-panel').addClass('show');
  });

  $('#close-box').click(function () {
    $('#notifications-panel').removeClass('show');
  });

  let avatarFrame = $('#user_box').find('.user_avatar');
  let avatarFrame1 = $('#user_box').find('.user_details');
  let name = '';
  let names = (frappe.user.name).trim().split(' ')
  names.forEach(function (word) {
    name += word[0].toUpperCase();
  });
  avatarFrame.html(name);
  let user_details = $(`<div>
    <h4>${frappe.session.user_fullname}</h4>
    <h3>${frappe.session.user_email}</h3>
  </div>`)
  avatarFrame1.html(user_details);

  new Workspace('.simplebar-content-wrapper');

  if (frappe.get_route() && frappe.get_route()[0] == 'setup-wizard') {
    $('#nxt_sidebar').addClass('hide');
    $('.loading-page .content').css({
      "margin-left": 0
    });
  }

});

class Workspace {
  constructor(wrapper) {
    this.wrapper = $(wrapper);
    this.page = wrapper.page;
    this.blocks = frappe.workspace_block.blocks;
    this.is_read_only = true;
    this.pages = {};
    this.sorted_public_items = [];
    this.sorted_private_items = [];
    this.current_page = {};
    this.sidebar_items = {
      public: {},
      private: {},
    };
    this.sidebar_categories = ["My Workspaces", "Public"];
    this.indicator_colors = [
      "green",
      "cyan",
      "blue",
      "orange",
      "yellow",
      "gray",
      "grey",
      "red",
      "pink",
      "darkgrey",
      "purple",
      "light-blue",
    ];

    this.prepare_container();
    this.setup_pages();
    this.register_awesomebar_shortcut();
  }

  prepare_container() {
    let list_sidebar = $(`
			<div class="main-sidebar overlay-sidebar">
				<div class="desk-sidebar list-unstyled sidebar-menu scrollable"></div>
			</div>
		`).appendTo(this.wrapper.find(".simplebar-content"));
    this.sidebar = list_sidebar.find(".desk-sidebar");
    this.body = this.wrapper.find(".layout-main-section");
  }

  async setup_pages(reload) {
    !this.discard && this.create_page_skeleton();
    !this.discard && this.create_sidebar_skeleton();
    this.sidebar_pages = !this.discard ? await this.get_pages() : this.sidebar_pages;
    this.cached_pages = $.extend(true, {}, this.sidebar_pages);
    this.all_pages = this.sidebar_pages.pages;
    this.has_access = this.sidebar_pages.has_access;

    this.all_pages.forEach((page) => {
      page.is_editable = !page.public || this.has_access;
    });

    this.public_pages = this.all_pages.filter((page) => page.public);
    this.private_pages = this.all_pages.filter((page) => !page.public);

    if (this.all_pages) {
      frappe.workspaces = {};
      for (let page of this.all_pages) {
        frappe.workspaces[frappe.router.slug(page.name)] = {
          title: page.title,
          public: page.public,
        };
      }
      this.make_sidebar();
      reload && this.show();
    }
  }

  get_pages() {
    return frappe.xcall("my_rmc.api.theme.get_workspace_sidebar_items");
  }

  sidebar_item_container(item) {
    item.indicator_color =
      item.indicator_color || this.indicator_colors[Math.floor(Math.random() * 12)];

    return $(`
			<li
				class="sidebar-item-container ${item.is_editable ? "is-draggable" : ""}"
				item-parent="${item.parent_page}"
				item-name="${item.title}"
				item-public="${item.public || 0}"
				item-is-hidden="${item.is_hidden || 0}"
			>
				<div class="side-menu__link ${item.selected ? "selected" : ""}">
					<a href="${item.unlink ? "#" : item.public ? "/app/" + frappe.router.slug(item?.link ? item.link : item.title) : "/app/private/" + frappe.router.slug(item?.link ? item.link : item.title)}"
						class="item-anchor link_to_page d-flex align-items-center ${item.is_editable ? "" : "block-click"}" title="${__(item.title)}"
					>
						<span class="w-5 h-5 side-menu__link__icon" item-icon=${item.icon || "folder-normal"}>
							${item.public
        ? frappe.utils.icon(item.icon || "folder-normal", "md")
        : `<span class="indicator ${item.indicator_color}"></span>`
      }
						</span>
						<span class="side-menu__link__title">${__(item.title)}<span>
					</a>
					<div class="sidebar-item-control"></div>
				</div>
				<ul class="sidebar-child-item nested-container hidden"></ul>
			</li>
		`);
  }

  make_sidebar() {
    if (this.sidebar.find(".standard-sidebar-section")[0]) {
      this.sidebar.find(".standard-sidebar-section").remove();
    }

    this.sidebar_categories.forEach((category) => {
      let root_pages = this.public_pages.filter(
        (page) => page.parent_page == "" || page.parent_page == null
      );
      if (category != "Public") {
        root_pages = this.private_pages.filter(
          (page) => page.parent_page == "" || page.parent_page == null
        );
      }
      root_pages = root_pages.uniqBy((d) => d.title);
      this.build_sidebar_section(category, root_pages);
    });

    // Scroll sidebar to selected page if it is not in viewport.
    this.sidebar.find(".selected").length &&
      !frappe.dom.is_element_in_viewport(this.sidebar.find(".selected")) &&
      this.sidebar.find(".selected")[0].scrollIntoView();

    this.remove_sidebar_skeleton();
  }

  build_sidebar_section(title, root_pages) {
    let sidebar_section = $(
      `<ul class="standard-sidebar-section nested-container mt-3" data-title="${title}"></ul>`
    );

    this.prepare_sidebar(root_pages, sidebar_section, this.sidebar);

    if (Object.keys(root_pages).length === 0) {
      sidebar_section.addClass("hidden");
    }

    $(".item-anchor").on("click", (e) => {
      $(".main-sidebar.hidden-xs.hidden-sm").removeClass("opened");
      $(".close-sidebar").css("display", "none");
      $("body").css("overflow", "auto");
      $(".main-sidebar .side-menu__link").removeClass("selected");
      $(e.target).closest(".side-menu__link").addClass("selected");

    });

    if (
      sidebar_section.find(".sidebar-item-container").length &&
      sidebar_section.find("> [item-is-hidden='0']").length == 0
    ) {
      sidebar_section.addClass("hidden show-in-edit-mode");
    }
  }

  prepare_sidebar(items, child_container, item_container) {
    items.forEach((item) => this.append_item(item, child_container));
    child_container.appendTo(item_container);
  }

  append_item(item, container) {

    let is_current_page =
      frappe.router.slug(item?.title ?? '') == frappe.router.slug(this.get_page_to_show().name ?? '') &&
      item.public == this.get_page_to_show().public;
    item.selected = is_current_page;
    if (is_current_page) {
      this.current_page = { name: item.title, public: item.public };
    }

    let $item_container = this.sidebar_item_container(item);
    let sidebar_control = $item_container.find(".sidebar-item-control");

    let pages = item.public ? this.public_pages : this.private_pages;

    let child_items = pages.filter((page) => page.parent_page == item.title);
    if (child_items.length > 0) {
      let child_container = $item_container.find(".sidebar-child-item");
      child_container.addClass("hidden");
      if (child_items.length > 0) {
        this.prepare_sidebar(child_items, child_container, $item_container);
      }
    }

    $item_container.appendTo(container);
    this.sidebar_items[item.public ? "public" : "private"][item.title] = $item_container;

    if ($item_container.parent().hasClass("hidden") && is_current_page) {
      $item_container.parent().toggleClass("hidden");
    }

    this.add_drop_icon(item, sidebar_control, $item_container, item?.shortcuts?.length > 0);

    if (child_items.length > 0 || item?.shortcuts?.length > 0) {
      $item_container.find(".drop-icon").first().addClass("show-in-edit-mode");
    }
  }

  add_drop_icon(item, sidebar_control, item_container) {
    let drop_icon = "es-line-down";
    if (item_container.find(`[item-name="${this.current_page.name}"]`).length) {
      drop_icon = "small-up";
    }

    let $child_item_section = item_container.find(".sidebar-child-item");
    let $drop_icon = $(`<button class="btn-reset drop-icon ml-2 hidden">`)
      .html(frappe.utils.icon(drop_icon, "sm"))
      .appendTo(sidebar_control);
    let pages = item.public ? this.public_pages : this.private_pages;
    if (
      pages.some(
        (e) => e.parent_page == item.title && (e.is_hidden == 0 || !this.is_read_only) || item?.showArrow)
    ) {
      $drop_icon.removeClass("hidden");
    }
    $drop_icon.on("click", () => {
      let icon =
        $drop_icon.find("use").attr("href") === "#es-line-down"
          ? "#es-line-up"
          : "#es-line-down";
      $drop_icon.find("use").attr("href", icon);
      $child_item_section.toggleClass("hidden");
    });
  }

  show() {
    if (!this.all_pages) {
      // pages not yet loaded, call again after a bit
      setTimeout(() => this.show(), 100);
      return;
    }

    let page = this.get_page_to_show();

    if (!frappe.router.current_route[0]) {
      frappe.route_flags.replace_route = true;
      frappe.set_route(frappe.router.slug(page.public ? page.name : "private/" + page.name));
      return;
    }

    this.page.set_title(__(page.name));
    this.update_selected_sidebar(this.current_page, false); //remove selected from old page
    this.update_selected_sidebar(page, true); //add selected on new page
  }

  update_selected_sidebar(page, add) {
    let section = page.public ? "public" : "private";
    if (
      this.sidebar &&
      this.sidebar_items[section] &&
      this.sidebar_items[section][page.name]
    ) {
      let $sidebar = this.sidebar_items[section][page.name];
      let pages = page.public ? this.public_pages : this.private_pages;
      let sidebar_page = pages.find((p) => p.title == page.name);

      if (add) {
        $sidebar[0].firstElementChild.classList.add("selected");
        if (sidebar_page) sidebar_page.selected = true;

        // open child sidebar section if closed
        $sidebar.parent().hasClass("sidebar-child-item") &&
          $sidebar.parent().hasClass("hidden") &&
          $sidebar.parent().removeClass("hidden");

        this.current_page = { name: page.name, public: page.public };
        localStorage.current_page = page.name;
        localStorage.is_current_page_public = page.public;
      } else {
        $sidebar[0].firstElementChild.classList.remove("selected");
        if (sidebar_page) sidebar_page.selected = false;
      }
    }
  }


  get_page_to_show() {
    let default_page;

    if (frappe.boot.user.default_workspace) {
      default_page = {
        name: frappe.boot.user.default_workspace.title,
        public: frappe.boot.user.default_workspace.public,
      };
    } else if (
      localStorage.current_page &&
      this.all_pages.filter((page) => page.title == localStorage.current_page).length != 0
    ) {
      default_page = {
        name: localStorage.current_page,
        public: localStorage.is_current_page_public != "false",
      };
    } else if (Object.keys(this.all_pages).length !== 0) {
      default_page = { name: this.all_pages[0].title, public: this.all_pages[0].public };
    } else {
      default_page = { name: "Build", public: true };
    }

    const route = frappe.get_route();
    const page = route ? (route[1] == "private" ? route[2] : route[1]) : default_page.name;
    const is_public = route ? route[1] ? route[1] != "private" : default_page.public : default_page.public;
    return { name: page, public: is_public };
  }

  reload() {
    this.sorted_public_items = [];
    this.sorted_private_items = [];
    this.setup_pages(true);
    this.discard = false;
    this.undo.readOnly = true;
  }

  create_page_skeleton() {
    if (this.body.find(".workspace-skeleton").length) return;

    this.body.prepend(frappe.render_template("workspace_loading_skeleton"));
    this.body.find(".codex-editor").addClass("hidden");
  }


  create_sidebar_skeleton() {
    if ($(".workspace-sidebar-skeleton").length) return;
    $(frappe.render_template("workspace_sidebar_loading_skeleton")).insertBefore(this.sidebar);
    this.sidebar.addClass("hidden");
  }

  remove_sidebar_skeleton() {
    this.sidebar.removeClass("hidden");
    $(".workspace-sidebar-skeleton").remove();
  }

  register_awesomebar_shortcut() {
    "abcdefghijklmnopqrstuvwxyz".split("").forEach((letter) => {
      const default_shortcut = {
        action: (e) => {
          $("#navbar-search").focus();
          return false; // don't prevent default = type the letter in awesomebar
        },
        page: this.page,
      };
      frappe.ui.keys.add_shortcut({ shortcut: letter, ...default_shortcut });
      frappe.ui.keys.add_shortcut({ shortcut: `shift+${letter}`, ...default_shortcut });
    });
  }
};

frappe.ui.Notifications = class Notifications {
  constructor() {
    this.tabs = {};
    this.notification_settings = frappe.boot.notification_settings;
    this.make();
  }

  make() {
    this.header_actions = $("#notifications-panel").find(".header-actions");

    this.setup_headers();
    new NotificationsView()
  }

  setup_headers() {
    $(`<a href="javascript:;" id="mark_all_as_read" data-tw-merge=""
                                class="transition duration-200 border shadow-sm items-center justify-center py-2 px-3 rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90 [&:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed border-secondary text-slate-500 dark:border-darkmode-100/40 dark:text-slate-300 [&:hover:not(:disabled)]:bg-secondary/20 [&:hover:not(:disabled)]:dark:bg-darkmode-100/10 sm:flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" data-lucide="bell" data-tw-merge=""
                                    class="lucide lucide-bell stroke-[1] mr-2 h-4 w-4 mark-all-as-read-bell">
                                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                                </svg>
		Mark all as read
		</a>`)
      .on("click", (e) => this.mark_all_as_read(e))
      .appendTo(this.header_actions)
      .attr("title", __("Mark all as read"))
      .tooltip({ delay: { show: 600, hide: 100 }, trigger: "hover" });
  }

  mark_all_as_read(e) {
    e.stopImmediatePropagation();
    frappe.call("frappe.desk.doctype.notification_log.notification_log.mark_all_as_read");
  }

};

frappe.ui.notifications = {
  get_notification_config() {
    alert('aa')
    return frappe.xcall("frappe.desk.notifications.get_notification_info").then((r) => {
      frappe.ui.notifications.config = r;
      return r;
    });
  },

  show_open_count_list(doctype) {
    if (!frappe.ui.notifications.config) {
      this.get_notification_config().then(() => {
        this.route_to_list_with_filters(doctype);
      });
    } else {
      this.route_to_list_with_filters(doctype);
    }
  },

  route_to_list_with_filters(doctype) {
    let filters = frappe.ui.notifications.config["conditions"][doctype];
    if (filters && $.isPlainObject(filters)) {
      if (!frappe.route_options) {
        frappe.route_options = {};
      }
      $.extend(frappe.route_options, filters);
    }
    frappe.set_route("List", doctype);
  },
};

class BaseNotificationsView {
  constructor(parent, settings) {
    this.wrapper = $("#notification_list");
    this.parent = parent;
    this.settings = settings;
    this.max_length = 20;
    this.container = $(`<div></div>`).appendTo(this.wrapper);
    this.make();
  }

  show() {
    this.container.show();
  }

  hide() {
    this.container.hide();
  }
}

class NotificationsView extends BaseNotificationsView {
  make() {
    this.setup_notification_listeners();
    this.get_notifications_list(this.max_length).then((r) => {
      if (!r.message) return;
      this.dropdown_items = r.message.notification_logs
      this.render_notifications_dropdown();
    });
  }

  update_dropdown() {
    this.get_notifications_list(1).then((r) => {
      if (!r.message) return;
      let new_item = r.message.notification_logs[0];
      this.dropdown_items.unshift(new_item);
      if (this.dropdown_items.length > this.max_length) {
        this.container.find(".recent-notification").last().remove();
        this.dropdown_items.pop();
      }
      this.insert_into_dropdown();
    });
  }

  change_activity_status() {
    if (this.container.find(".activity-status")) {
      this.container.find(".activity-status").replaceWith(
        `<a class="recent-item text-center text-muted"
					href="/app/List/Notification Log">
					<div class="full-log-btn">${__("View Full Log")}</div>
				</a>`
      );
    }
  }

  mark_as_read(docname, $el) {
    frappe
      .call("frappe.desk.doctype.notification_log.notification_log.mark_as_read", {
        docname: docname,
      })
      .then(() => {
        $el.removeClass("unread");
      });
  }

  insert_into_dropdown() {
    let new_item = this.dropdown_items[0];
    let new_item_html = this.get_dropdown_item_html(new_item);
    $(new_item_html).prependTo(this.container);
    this.change_activity_status();
  }

  get_dropdown_item_html(notification_log) {
    let doc_link = this.get_item_link(notification_log);

    let read_class = notification_log.read ? "" : "unread";
    let message = notification_log.subject;

    let title = message.match(/<b class="subject-title">(.*?)<\/b>/);
    message = title
      ? message.replace(title[1], frappe.ellipsis(strip_html(title[1]), 100))
      : message;

    let timestamp = frappe.datetime.comment_when(notification_log.creation);
    let message_html = `<div class="message">
			<div>${message}</div>
			<div class="notification-timestamp text-muted">
				${timestamp}
			</div>
		</div>`;

    let user = notification_log.from_user;
    let user_avatar = frappe.avatar(user, "avatar-medium user-avatar");

    let item_html = $(`<a class="recent-item notification-item ${read_class}"
				href="${doc_link}"
				data-name="${notification_log.name}"
			>
				<div class="notification-body">
					${user_avatar}
					${message_html}
				</div>
				<div class="mark-as-read" title="${__("Mark as Read")}">
				</div>
			</a>`);

    if (!notification_log.read) {
      let mark_btn = item_html.find(".mark-as-read");
      mark_btn.tooltip({ delay: { show: 600, hide: 100 }, trigger: "hover" });
      mark_btn.on("click", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.mark_as_read(notification_log.name, item_html);
      });
    }

    item_html.on("click", () => {
      !notification_log.read && this.mark_as_read(notification_log.name, item_html);
      this.notifications_icon.trigger("click");
    });

    return item_html;
  }

  render_notifications_dropdown() {
    if (this.settings && !this.settings.enabled) {
      this.container.html(`<li class="recent-item notification-item">
				<span class="text-muted">
					${__("Notifications Disabled")}
				</span></li>`);
    } else {
      if (this.dropdown_items.length) {
        this.container.empty();
        this.dropdown_items.forEach((notification_log) => {
          this.container.append(this.get_dropdown_item_html(notification_log));
        });
        this.container.append(`<a class="list-footer"
					href="/app/List/Notification Log">
						<div class="full-log-btn">${__("See all Activity")}</div>
					</a>`);
      } else {
        this.container.append(
          $(`<div class="notification-null-state">
					<div class="text-center">
						<img src="/assets/frappe/images/ui-states/notification-empty-state.svg" alt="Generic Empty State" class="null-state">
						<div class="title">${__("No New notifications")}</div>
						<div class="subtitle">
							${__("Looks like you haven’t received any notifications.")}
					</div></div></div>`)
        );
      }
    }
  }

  get_notifications_list(limit) {
    return frappe.call(
      "frappe.desk.doctype.notification_log.notification_log.get_notification_logs",
      { limit: limit }
    );
  }

  get_item_link(notification_doc) {
    if (notification_doc.link) {
      return notification_doc.link;
    }
    const link_doctype = notification_doc.document_type
      ? notification_doc.document_type
      : "Notification Log";
    const link_docname = notification_doc.document_name
      ? notification_doc.document_name
      : notification_doc.name;
    return frappe.utils.get_form_link(link_doctype, link_docname);
  }

  setup_notification_listeners() {
    frappe.realtime.on("notification", () => {
      this.update_dropdown();
    });
  }
}