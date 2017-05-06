import bs4,re,builtins

def html(xnode):
    if xnode==None:
        return None

    return xnode[0].contents[0]

def substring(param):
    if param==None:
        return None

    return param[:200]

def substract(param):
    if param==None:
        return None
    group=re.search(r'(.+)<.*',param)

    if group==None:
        return param

    return group.group(1)

def strip(param):
    if param==None:
        return None

    return param.strip()

def text(xnode):
    if xnode==None or len(xnode)==0:
        raise Exception('text wrong')

    return xnode[0].text.strip()

def nextsibling(xnode):
    if xnode==None or len(xnode)==0:
        raise Exception('nextsibling wrong')

    return xnode[0].next_sibling

def attr(key):
    def attrNode(xnode):
        if xnode==None or len(xnode)==0:
            raise Exception('attr wrong')
        return xnode[0].get(key)
    return attrNode

def int(v):
    if v==None:
        raise Exception('int wrong')
    try:
        return builtins.int(v)
    except ValueError:
        return None

lambdaTable={
    'text':text,
    'int':int,
    'strip':strip,
    'nextsibling':nextsibling,
    'substract':substract,
    'substring':substring,
    'html':html
}

class xpathNode:

    def __init__(self, child=True, tagName=None, attrs=None, position=None):

        self.child = child
        self.tagName = tagName
        self.attrs = attrs
        self.position = position

    def match(self, xnode):
        try:

            if xnode==None:
                return None

            if self.child:
                nextElements = xnode.children
            else:
                nextElements = xnode.descendants

            results = []

            for element in nextElements:

                if element.name == self.tagName:

                    results.append(element)

            if self.attrs != None:
                _tempt = []

                for element in results:
                    match = True

                    for k, v in self.attrs.items():
                        #诡异，做了个trick
                        value=element.get(k,None)

                        if value!=None and isinstance(value,list):
                            value=" ".join(element.get(k,[]))

                        if value!=v:
                            match = False
                            break
                        else:
                            pass

                    if match == True:

                        _tempt.append(element)

                results = _tempt


            if self.position != None:
                return [results[self.position]]

            return results

        except Exception:
            return None

def buildParse(xpath=None):

    xpath = xpath.split('->')

    xpathElements = re.finditer(r'([/]+)([^/]*)', xpath[0])

    chain = []

    for xpathElement in xpathElements:
        child = True

        if xpathElement.group(1) == '//':
            child = False

        attrs = None
        position = None

        statement = xpathElement.group(2)
        group = re.search('([^\[]+)(.*)', statement)

        tagName = group.group(1)

        predication = group.group(2)

        if predication != None and predication != '':

            group = re.search(r'\[@(.+)=([\'|"]?)(.+)\2\]', predication)

            if group != None:
                key = group.group(1)
                value = group.group(3)

                if key == 'position':
                    position = int(value)
                else:
                    position=None
                    attrs = {key: value}

        node = xpathNode(child=child, tagName=tagName, attrs=attrs, position=position)
        chain.append(node)

    lamdaChain = []


    for xpathElement in xpath[1:]:
        group=re.match(r'attr\[(.+)\]',xpathElement)

        if group==None and lambdaTable.get(xpathElement,None)!=None:
            lamdaChain.append(lambdaTable.get(xpathElement,None))
        else:
            lamdaChain.append(attr(group.group(1)))

    return chain,lamdaChain


def commonParse(html=None, xpath=None,root=None):

    try:
        if html==None and root==None:
            raise Exception('html and root missing')

        if root==None:
            try:
                root = bs4.BeautifulSoup(html, "html.parser")
            except Exception as e:
                raise Exception('build xpath wrong')

        chain,lamdaChain=buildParse(xpath)

        xpathResults = [root]

        for xpathNode in chain:

            xpathSearchNodes = xpathResults

            xpathResults = []

            for xnode in xpathSearchNodes:

                xpathResults.extend(xpathNode.match(xnode))

        result=xpathResults

        for lamdaFunc in lamdaChain:
            result=lamdaFunc(result)

        return result

    except Exception as e:
        #raise e
        return None

    
'''
xpath={
    'headImg':'.//div[@class="space_b_pic_con"]/img->attr[src]',
    'doctorHospital':'.//div[@class="doc_hospital clearfix"]//p/a[@position=0]->text',
    'doctorDepartment':'.//div[@class="doc_hospital clearfix"]//p/a[@position=1]->text',
    'title':'.//p[@class="f22 fyhei tc pb5"]->text',
    'readNum':'.//p[@id="hits"]->text->int',
    'summary':'.//div[@class="pb20 article_detail"]->text->substring'
}
'''
