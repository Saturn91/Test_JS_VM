function replaceAllMultipleWhiteSpacesFromString(string_value) {
    return string_value.replace(/\s+/g, " ");
}

function countSubStringInString(string_value, subStr) {
    let match = string_value.match(new RegExp(subStr, "g") || []);
    return match ? match.length : 0;
}