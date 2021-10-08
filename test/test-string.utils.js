TEST_SUITE.runAllTestsComplete = false;
{
    testTitle('test string utils')
    let test_string = 'aaaab';
    assert('counts 4 a\'s in string', countSubStringInString(test_string, 'a') == 4, true);

    test_string = 'nananab';
    assert('counts 3 na\'s in string', countSubStringInString(test_string, 'na') == 3, true);

    test_string = '  test   banana';
    assert('gets rid of multiple spaces', replaceAllMultipleWhiteSpacesFromString(test_string) == ' test banana', true);

    test_string = `  
    test   
    banana`;
    assert('gets rid of multiple lines and spaces', replaceAllMultipleWhiteSpacesFromString(test_string) == ' test banana', true);
}
