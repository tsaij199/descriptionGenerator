import string
from flask import jsonify

def complete(str):
    if not str.endswith(('.','!','?')):
        i = max(str.rfind('.'), str.rfind('!'), str.rfind('?'))
        list = ['Sr', 'Jr', 'Mr', 'Ms', 'Dr']
        while str[i-1:i] in string.ascii_uppercase or str[i-2:i] in list:
            i = max(str[:i].rfind('.'), str[:i].rfind('!'), str[:i].rfind('?'))
        str = str[:i+1]
    return jsonify({"response": str})

def noNum(str):
    for i in range(len(str)-1):
        if str[i].isdigit() and str[i+1] == '.':
            str = str[:i] + "  " + str[i+2:]
    return str