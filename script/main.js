'use strict';

{
  const preview_button = document.getElementById("preview_button");
  const copy_button = document.getElementById("copy_button");

  var simplemde = new SimpleMDE({
    element: document.getElementById('editor-main'),
    autosave: {
      enabled: true,
      uniqueId: "markdownblogeditor",
      delay: 1000,
    },
    forceSync: true,
    spellChecker: false,
    toolbar: false,
    status: false,
    indentWithTabs: false
  })

  marked.setOptions({
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
  });

  preview_button.addEventListener('click', () => {
    var markdown = document.getElementById("editor").value;
    var html = marked(markdown);
    $('#marked-preview').html(html);

    $('#result').val(html);
  });

  function copy_to_clipboard(idname, message) {
    // コピー対象をJavaScript上で変数として定義する
    let copyTarget = document.getElementById(idname);
    console.log(copyTarget);
    // コピー対象のテキストを選択する
    copyTarget.select();

    // 選択しているテキストをクリップボードにコピーする
    document.execCommand("Copy");
    // コピーをお知らせする
    alert(message);
  }

  result_copy_button.addEventListener('click', () => {
    copy_to_clipboard("result", "クリップボードにコピーしました！(HTML結果)");
  });

  let html_title = "title";
  let html_name  = "filename";
  save_button.addEventListener('click', () => {
    html_title = prompt("What HTML title is it ?", "title");
    console.log('a Title of save file is ' + html_title);
    html_name = prompt("What name of HTML file is it ?", "filename");
    html_name += '.html';
    console.log('a file name is ' + html_name);

    // refer : https://blog.mudatobunka.org/entry/2015/12/23/211425
    var html = document.getElementById("marked-preview");
    // ソースコードをテキストで取得
    var src = "<body>\n" + html.innerHTML + "\n</body>\n";
    console.log(src.slice(0, 5000));

    // 上記の src には DOCTYPE が含まれていないので別途用意
    var name = document.doctype.name;
    var publicId = document.doctype.publicId;
    var systemID = document.doctype.systemId;
    var doctype = '<!DOCTYPE ' + name
      + (publicId ? ' PUBLIC "' + publicId + '"' : '')
      + (systemID ? ' "' + systemID + '"' : '')
      + '>';
    console.log(doctype);

    var htmlTag = '<html';
    var attrs = html.attributes;
    for (var i = 0, n = attrs.length; i < n; i++) {
      var attr = attrs[i];
      htmlTag += ' ' + attr.nodeName + (attr.nodeValue ? '="' + attr.nodeValue + '"' : '');
    }
    htmlTag += '>';
    console.log(htmlTag);

    var headTag= '<head>\n';
    headTag += '<title>' + html_title + '</title>\n';
    headTag += '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    headTag += '<meta charset="utf-8">\n';
    headTag += '<link rel="stylesheet" href="css/styles.css">\n';
    headTag += '</head>';
    console.log(headTag);

    // ソースコードを Blob オブジェクトに変換してURLを取得
    var blob = new Blob([doctype, '\n', htmlTag, '\n', headTag, '\n', src, '\n</html>']);
    var url = window.URL || window.webkitURL;
    var blobURL = url.createObjectURL(blob);

    // <a> を新たに作成し、ダウンロード用の設定をいろいろ
    var a = document.createElement('a');
    // URI を元にダウンロード時のファイル名を決定
    // a.download = decodeURI(location.pathname + location.hash).replace(/\//g, '__').replace(/#/g, '--') + '.html';
    a.download = html_name;
    a.href = blobURL;

    a.click();
  });

}
