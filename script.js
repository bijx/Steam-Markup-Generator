const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const buttons = document.querySelectorAll('.buttons button');

editor.addEventListener('input', function () {
  let content = editor.value;

  content = content.replace(/\[h1\](.*?)\[\/h1\]/g, '<h1>$1</h1>');
  content = content.replace(/\[b\](.*?)\[\/b\]/g, '<b>$1</b>');
  content = content.replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>');
  content = content.replace(/\[i\](.*?)\[\/i\]/g, '<i>$1</i>');
  content = content.replace(
    /\[strike\](.*?)\[\/strike\]/g,
    '<strike>$1</strike>'
  );
  content = content.replace(
    /\[spoiler\](.*?)\[\/spoiler\]/g,
    '<span style="background-color: black; color: black;" onclick="this.style.color=\'white\'">$1</span>'
  );
  content = content.replace(/\[noparse\](.*?)\[\/noparse\]/g, '<pre>$1</pre>');
  content = content.replace(/\[hr\]/g, '<hr>');
  content = content.replace(/\[code\](.*?)\[\/code\]/g, '<code>$1</code>');

  preview.innerHTML = content;
});

buttons.forEach((button) => {
  button.addEventListener('click', function () {
    const tag = this.getAttribute('data-tag');
    let startTag = `[${tag}]`;
    let endTag = tag !== 'hr' ? `[/${tag}]` : ''; // No end tag for [hr]

    const selectionStart = editor.selectionStart;
    const selectionEnd = editor.selectionEnd;

    editor.setRangeText(
      startTag + editor.value.substring(selectionStart, selectionEnd) + endTag,
      selectionStart,
      selectionEnd,
      'select'
    );

    editor.dispatchEvent(new Event('input'));
  });
});

editor.addEventListener('keydown', function (e) {
  if (e.ctrlKey) {
    // Check if the Control key is pressed
    let tag = '';

    switch (e.key) {
      case 'b':
      case 'B':
        tag = 'b';
        break;
      case 'i':
      case 'I':
        tag = 'i';
        break;
      case 'u':
      case 'U':
        tag = 'u';
        break;
    }

    if (e.shiftKey) {
      // Check if the Shift key is pressed along with Control key
      switch (e.key) {
        case 'X':
          tag = 'strike';
          break;
        case 'H':
          tag = 'h1';
          break;
      }
    }

    if (tag) {
      const startTag = `[${tag}]`;
      const endTag = tag !== 'hr' ? `[/${tag}]` : ''; // No end tag for [hr]

      const selectionStart = editor.selectionStart;
      const selectionEnd = editor.selectionEnd;

      editor.setRangeText(
        startTag +
          editor.value.substring(selectionStart, selectionEnd) +
          endTag,
        selectionStart,
        selectionEnd,
        'select'
      );

      editor.dispatchEvent(new Event('input'));
      e.preventDefault(); // To prevent any default action for the key combination
    }
  }
});
