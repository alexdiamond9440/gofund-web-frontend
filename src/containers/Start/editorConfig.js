export const config = {
  zIndex: 0,
  readonly: false,
  activeButtonsInReadOnly: ['source', 'fullsize', 'print', 'about', 'dots'],
  toolbarButtonSize: 'middle',
  theme: 'default',
  saveModeInCookie: false,
  spellcheck: true,
  editorCssClass: 'editor-minheight',
  triggerChangeEvent: true,
  width: 'auto',
  height: 'auto',
  minHeight: 200,
  direction: '',
  language: 'auto',
  debugLanguage: false,
  i18n: 'en',
  tabIndex: -1,
  toolbar: true,
  enter: 'P',
  useSplitMode: false,
  colorPickerDefaultTab: 'background',
  imageDefaultWidth: 300,
  removeButtons: [],
  disablePlugins: [],
  extraButtons: [],
  sizeLG: 900,
  sizeMD: 700,
  sizeSM: 400,
  // sizeSM: 400,
  buttons: [
    'bold',
    'paragraph',
    'brush',
    'font',
    'fontsize',
    'image',
    'link',
    'undo',
    'redo',
    'fullsize',
  ],
  buttonsXS: [
    'bold',
    'paragraph',
    'brush',
    'font',
    'fontsize',
    'image',
    'link',
    'undo',
    'redo',
    'fullsize',
  ],
  buttonsMD: [
    'bold',
    'paragraph',
    'brush',
    'font',
    'fontsize',
    'image',
    'link',
    'undo',
    'redo',
    'fullsize',
  ],
  buttonsSM: [
    'bold',
    'paragraph',
    'brush',
    'font',
    'fontsize',
    'image',
    'link',
    'undo',
    'redo',
    'fullsize',
  ],
  events: {
    getIcon: function(name, control, clearName) {
      var code = clearName;
      switch (clearName) {
        case 'bold':
          code = 'Bold';
          break;
        case 'paragraph':
          code = 'Paragraph';
          break;
        case 'brush':
          code = 'Color';
          break;
        case 'about':
          code = 'question';
          break;
        case 'font':
          code = 'Font';
          break;
        case 'fontsize':
          code = 'Font size';
          break;
        case 'image':
          code = 'Add Photo';
          break;
        case 'link':
          code = 'Link';
          break;
        case 'undo':
          code = 'Undo';
          break;
        case 'redo':
          code = 'Redo';
          break;
        case 'fullsize':
          code = 'Full size';
          break;
        default:
          return '';
      }
      return `<span>${code}</span>`;
    },
  },
  uploader: {
    insertImageAsBase64URI: true,
  },
  textIcons: false,
};
