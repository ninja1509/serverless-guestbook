/**
 * Web application
 */
const apiUrl = 'https://eu-gb.functions.appdomain.cloud/api/v1/web/samaahsarang14s%40gmail.com_dev/guestBook';
const guestbook = {
  // retrieve the existing guestbook entries
  get() {
    return $.ajax({
      type: 'GET',
      url: `${apiUrl}/read-guestbook-entries-sequence`,
      dataType: 'json'
    });
  },
  // add a single guestbood entry
  add(name, email, comment) {
    console.log('Sending', name, email, comment)
    return $.ajax({
      type: 'PUT',
      url: `${apiUrl}/save-guestbook-entry-sequence`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        name,
        email,
        comment,
      }),
      dataType: 'json',
    });
  }
};

(function() {

  let entriesTemplate;

  function prepareTemplates() {
    entriesTemplate = Handlebars.compile($('#entries-template').html());
  }

  // retrieve entries and update the UI
  function loadEntries() {
    console.log('Loading entries...');
    $('#read-guestbook-entries-sequence').html('Loading entries...');
    guestbook.get().done(function(result) {
      if (!result.read-guestbook-entries-sequence) {
        return;
      }

      const context = {
        entries: result.read-guestbook-entries-sequence
      }
      $('#read-guestbook-entries-sequence').html(entriesTemplate(context));
    }).error(function(error) {
      $('#read-guestbook-entries-sequence').html('No entries');
      console.log(error);
    });
  }

  // intercept the click on the submit button, add the guestbook entry and
  // reload entries on success
  $(document).on('submit', '#addEntry', function(e) {
    e.preventDefault();

    guestbook.add(
      $('#name').val().trim(),
      $('#email').val().trim(),
      $('#comment').val().trim()
    ).done(function(result) {
      // reload entries
      loadEntries();
    }).error(function(error) {
      console.log(error);
    });
  });

  $(document).ready(function() {
    prepareTemplates();
    loadEntries();
  });
})();
