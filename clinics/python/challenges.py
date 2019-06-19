def big_vowels(text:str="hello"):
    result:str = ""
    for i in text.lower():
        result += i.upper() if i in {'a','e','i','o','u'} else i
    
    return result

print('answer:', big_vowels("what in the world"))
