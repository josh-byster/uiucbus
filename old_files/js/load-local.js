if (typeof window.jQuery === 'undefined') {
    console.log("Falling back to local copy of jQuery");
    document.write('<script src="cdn-backup/jquery-3.3.1.min.js"></script>');
}

if (typeof Popper === 'undefined') {
    console.log("Falling back to local copy of jQuery, Popper, Bootstrap, and EasyAutocomplete");
    document.write('<script src="cdn-backup/popper.min.js"></script>');
    document.write('<link rel="stylesheet" href="cdn-backup/bootstrap.min.css"></script>');
    document.write('<link rel="stylesheet" href="cdn-backup/easy-autocomplete.themes.css"></script>');
    document.write('<link rel="stylesheet" href="cdn-backup/easy-autocomplete.min.css"></script>');
}
if (typeof Cookies === 'undefined') {
    console.log("Falling back to local copy of Cookies plugin");
    document.write('<script src="cdn-backup/js.cookie.min.js"></script>');
}

if(typeof $().modal === 'undefined') {    
    console.log("Falling back to local copy of BootstrapJS");
    document.write('<script src="cdn-backup/bootstrap.min.js"></script>');
}