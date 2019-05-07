module.exports = function (template) {
    let title = template.htmlWebpackPlugin.options.title;
    let scripts = '';
    let commons = template.htmlWebpackPlugin.options.common;
    try {
        for (var chunk in commons) {
            scripts += `<script type="text/javascript" src="${commons[chunk]}"></script>\r\n`;
        }
    } catch (error) { }
    return (
        `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
    <title>${title}</title>
    ${scripts}
</head>
<body>
    <div id=${template.htmlWebpackPlugin.options.root}></div>
</body>
</html>`
    )
}
