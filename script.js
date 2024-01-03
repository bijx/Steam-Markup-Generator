const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const buttons = document.querySelectorAll('.buttons button');

function updatePreview() {
  let content = editor.value;

  content = content.replace(/\n/g, '<br>');
  content = content.replace(/\[h1\](.*?)\[\/h1\]/g, '<h1>$1</h1>');
  content = content.replace(/\[h2\](.*?)\[\/h2\]/g, '<h2>$1</h2>');
  content = content.replace(/\[h3\](.*?)\[\/h3\]/g, '<h3>$1</h3>');
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
  content = content.replace(
    /\[quote=(.*?)\](.*?)\[\/quote\]/g,
    '<div class="quote-box"><p class="quote-author">Originally posted by <i>$1</i>:</p><p>$2</p></div>'
  );
  content = content.replace(/\[url=(.*?)\](.*?)\[\/url\]/g, '<a href="$1" target="_blank">$2</a>');

  preview.innerHTML = content;
}

editor.addEventListener('input', updatePreview);

buttons.forEach((button) => {
  button.addEventListener('click', function () {
    const tag = this.getAttribute('data-tag');

    if (tag === 'quote') {
      const selectedText = editor.value.substring(
        editor.selectionStart,
        editor.selectionEnd
      );
      document.getElementById('quoteText').value = selectedText;
      document.getElementById('quoteModal').style.display = 'flex';
      return;
    }

    if (tag === 'url') {
      const selectedText = editor.value.substring(editor.selectionStart, editor.selectionEnd);
      document.getElementById('urlText').value = selectedText;
      document.getElementById('urlModal').style.display = 'flex';
      return;
    }

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

    updatePreview();
  });
});

document.getElementById('insertQuote').addEventListener('click', function () {
  const author = document.getElementById('author').value;
  const quote = document.getElementById('quoteText').value;
  const insertion = `[quote=${author}] ${quote} [/quote]`;
  const beforeSelection = editor.value.substring(0, editor.selectionStart);
  const afterSelection = editor.value.substring(
    editor.selectionEnd,
    editor.value.length
  );
  editor.value = beforeSelection + insertion + afterSelection;
  document.getElementById('quoteModal').style.display = 'none';
  updatePreview();
});

document.getElementById('insertUrl').addEventListener('click', function () {
  const url = document.getElementById('urlInput').value;
  const linkText = document.getElementById('urlText').value;
  const insertion = `[url=${url}]${linkText}[/url]`;
  const beforeSelection = editor.value.substring(0, editor.selectionStart);
  const afterSelection = editor.value.substring(editor.selectionEnd, editor.value.length);
  editor.value = beforeSelection + insertion + afterSelection;
  document.getElementById('urlModal').style.display = 'none';
  updatePreview();
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
      case 'k':
      case 'K':
        const selectedText = editor.value.substring(editor.selectionStart, editor.selectionEnd);
        document.getElementById('urlText').value = selectedText;
        document.getElementById('urlModal').style.display = 'flex';
        e.preventDefault();
        return;
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

      updatePreview();
      e.preventDefault(); // To prevent any default action for the key combination
    }
  }
});


/* LocalStorage */

// Save to localStorage
function saveTextAsLocalStorage() {
  const text = editor.value;
  localStorage.setItem("markupText", text);
}

// Load from localStorage
function loadTextFromLocalStorage() {
  const savedText = localStorage.getItem("markupText");
  if (savedText) {
      editor.value = savedText;
      updatePreview();
  }
}

// Event listeners
editor.addEventListener('input', function () {
  saveTextAsLocalStorage();  
});

document.addEventListener('DOMContentLoaded', (event) => {
  loadTextFromLocalStorage();
});
