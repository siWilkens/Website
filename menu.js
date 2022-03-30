$(document).ready( () => {
    $("button").click((e) => {
        $( "object" ).replaceWith('<object data="' + e.currentTarget.id+ ".html" + '"></object>')
    })
})