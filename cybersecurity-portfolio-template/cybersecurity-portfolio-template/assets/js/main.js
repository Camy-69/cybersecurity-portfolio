document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('nav-open', !expanded);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('nav-open');
    }));
  }

  const filters = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('[data-category]');
  const emptyState = document.getElementById('no-projects');
  filters.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    let visible = 0;
    cards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (emptyState) emptyState.hidden = visible !== 0;
  }));

  const courseCatalog = document.getElementById('course-catalog');
  if (courseCatalog) {
    const courseRows = [...courseCatalog.querySelectorAll('.course-unit')];
    const courseFilters = [...document.querySelectorAll('[data-course-filter]')];
    const search = document.getElementById('course-search');
    const requiredOnly = document.getElementById('required-only');
    const resultCount = document.getElementById('course-filter-results');
    const emptyState = document.getElementById('course-empty-state');

    const applyCourseFilters = () => {
      const selectedStatus = courseFilters.find(button => button.getAttribute('aria-pressed') === 'true')?.dataset.courseFilter || 'all';
      const query = (search?.value || '').trim().toLowerCase();
      const onlyRequired = Boolean(requiredOnly?.checked);
      let visible = 0;
      courseRows.forEach(row => {
        const statusMatch = selectedStatus === 'all' || row.dataset.courseStatus === selectedStatus;
        const requiredMatch = !onlyRequired || row.dataset.required === 'true';
        const searchMatch = !query || row.dataset.search.includes(query) || row.textContent.toLowerCase().includes(query);
        const show = statusMatch && requiredMatch && searchMatch;
        row.hidden = !show;
        if (show) visible += 1;
      });
      courseCatalog.querySelectorAll('[data-course-group]').forEach(group => {
        const groupRows = [...group.querySelectorAll('.course-unit')];
        const anyVisible = groupRows.some(row => !row.hidden);
        group.hidden = !anyVisible;
        if (selectedStatus !== 'all' || query || onlyRequired) group.open = anyVisible;
        else if (group.id !== 'section-a') group.open = false;
      });
      if (resultCount) resultCount.textContent = `Showing ${visible} ${visible === 1 ? 'unit' : 'units'}${onlyRequired ? ' (required only)' : ''}.`;
      if (emptyState) emptyState.hidden = visible !== 0;
    };

    courseFilters.forEach(button => button.addEventListener('click', () => {
      courseFilters.forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      applyCourseFilters();
    }));
    if (search) search.addEventListener('input', applyCourseFilters);
    if (requiredOnly) requiredOnly.addEventListener('change', applyCourseFilters);
    applyCourseFilters();
  }

  document.querySelectorAll('.toggle-edit').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.lab-card');
      const surface = card?.querySelector('.edit-surface');
      if (!surface) return;

      const editing = surface.getAttribute('contenteditable') === 'true';
      surface.setAttribute('contenteditable', String(!editing));
      surface.classList.toggle('is-editing', !editing);
      button.textContent = editing ? 'Edit text' : 'Save text';
    });
  });

  document.querySelectorAll('.image-upload').forEach(input => {
    input.addEventListener('change', event => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      const imageBox = input.closest('.lab-visual-box');
      const preview = imageBox?.querySelector('img');
      reader.onload = () => {
        if (!preview) {
          const img = document.createElement('img');
          img.alt = 'Inserted coursework image';
          img.src = reader.result;
          imageBox.appendChild(img);
        } else {
          preview.src = reader.result;
        }
        imageBox.classList.add('has-image');
      };
      reader.readAsDataURL(file);
    });
  });

  document.querySelectorAll('.edit-all').forEach(button => {
    const panels = [...document.querySelectorAll('.edit-surface')];
    button.addEventListener('click', () => {
      const open = panels.some(panel => panel.getAttribute('contenteditable') === 'true');
      panels.forEach(panel => {
        panel.setAttribute('contenteditable', String(!open));
        panel.classList.toggle('is-editing', !open);
      });
      document.querySelectorAll('.toggle-edit').forEach(toggle => {
        toggle.textContent = open ? 'Edit text' : 'Save text';
      });
      button.textContent = open ? 'Edit text' : 'Save text';
    });
  });

});
