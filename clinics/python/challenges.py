# answer key

def big_vowels(text:str="hello"):
    result:str = ""
    for i in text.lower(): # normalize the input
        # a member test on a set has O(1) complexity
        # ternary is concise but still readable
        result += i.upper() if i in {'a','e','i','o','u'} else i
    
    return result

print('answer:', big_vowels("what in the world")) # -> whAt In thE wOrld

# TODO: add tests
