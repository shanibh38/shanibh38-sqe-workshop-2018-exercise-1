import * as esprima from 'esprima';

var mainTable = [];
var callFromFunc = 0;
var elseifTrue = false;
var typeState = '';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse, {loc:true});
};

const clearTable=()=>{
    mainTable=[];
};

const statmentType ={
    'FunctionDeclaration' : parsefunctionDeclaration,
    'Identifier' : parseIdentifier,
    'Literal' : parseLiteral,
    'VariableDeclaration' : parseVariableDeclaration,
    'VariableDeclarator' : parseVariableDeclarator,
    'AssignmentExpression' : parseAssignmentExpression,
    'ExpressionStatement' : parseExpressionStatement,
    'WhileStatement' : parseWhileStatement,
    'ForStatement' : parseForStatement,
    'ReturnStatement' : parseReturnStatement, 
    'IfStatement' : parseIfStatement,
    'BinaryExpression' : parseBinaryExpression, 
    'UnaryExpression' : parseUnaryExpression, 
    'MemberExpression' : parseMemberExpression, 
    'UpdateExpression' : parseUpdateExpression, 
    'LogicalExpression' : parseLogicalExpression,
    'CallExpression' : parseCallExpression,
    'NewExpression' : parseNewExpression,
    'ObjectExpression' : parseObjectExpression,
    'ArrayExpression' : parseArrayExpression,
};


const parseJSon=(parseObj)=>{
    if(parseObj!=undefined)
    {
        if (!Array.isArray(parseObj.body)) {
            statmentType[parseObj.type](parseObj);
        }
        else {
            for (var i=0;i<parseObj.body.length;i++){
                statmentType[parseObj.body[i].type](parseObj.body[i]);
            }
        }
        return mainTable;
    }
    else
        return mainTable;
};

function parsefunctionDeclaration(parseObj){
    callFromFunc = 1;
    mainTable.push( {
        'Line':parseObj.loc.start.line,
        'Type' : parseObj.type,
        'Name' : statmentType[parseObj.id.type](parseObj.id),
        'Condition' : '',
        'Value': ''} );
    callFromFunc = 0;
    for (var i=0;i<parseObj.params.length;i++) {
        callFromFunc = 1;
        mainTable.push( {
            'Line' : parseObj.params[i].loc.start.line,
            'Type' : parseObj.params[i].type,
            'Name' : ''+ statmentType[parseObj.params[i].type](parseObj.params[i]),
            'Condition' : '',
            'Value': '',    } );
        callFromFunc = 0; }
    parseJSon(parseObj.body);
}

function parseVariableDeclaration(parseObj){
    for (var i=0;i<parseObj.declarations.length;i++) {
        parseJSon(parseObj.declarations[i]);
    }
}

function parseExpressionStatement(parseObj){
    parseJSon(parseObj.expression);
}

function parseAssignmentExpression(parseObj){
    var operatorVar = '';
    if (parseObj.operator!='=')
        operatorVar = parseObj.operator;
    else
        operatorVar = '';
    callFromFunc = 1;
    mainTable.push(
        {
            'Line' : parseObj.loc.start.line,
            'Type' : parseObj.type,
            'Name' :  ''+ statmentType[parseObj.left.type](parseObj.left),
            'Condition' : '',
            'Value': ''+  operatorVar+statmentType[parseObj.right.type](parseObj.right),
        }
    );
    callFromFunc = 0;
}

function parseWhileStatement(parseObj){
    callFromFunc = 1;
    mainTable.push(
        {
            'Line' : parseObj.loc.start.line,
            'Type' : parseObj.type,
            'Name' : '',
            'Condition' : ''+ statmentType[parseObj.test.type](parseObj.test),
            'Value': '',
        }
    );
    callFromFunc = 0;
    parseJSon(parseObj.body);
}

function forInit(parseObj){
    if (parseObj!=undefined){
        if (parseObj.type=='AssignmentExpression')
            return statmentType[parseObj.left.type](parseObj.left)+parseObj.operator+ statmentType[parseObj.right.type](parseObj.right);
        else if (parseObj.type=='VariableDeclaration')
        {
            var forInitVal=parseObj.kind+' ';
            for (var i=0;i<parseObj.declarations.length;i++)
            {
                forInitVal=forInitVal+statmentType[parseObj.declarations[i].id.type](parseObj.declarations[i].id)+'='+statmentType[parseObj.declarations[i].init.type](parseObj.declarations[i].init);
            }
            return forInitVal;
        }
        else
            return statmentType[parseObj.type](parseObj);
    }
    else
        return '';
}

function parseForStatement(parseObj){
    callFromFunc = 1;
    mainTable.push(
        {
            'Line' : parseObj.loc.start.line,
            'Type' : parseObj.type,
            'Name' : '',
            'Condition' : '(' +forInit(parseObj.init)+';'+statmentType[parseObj.test.type](parseObj.test)+';'+statmentType[parseObj.update.type](parseObj.update)+')',
            'Value' : ''
        }
    );
    callFromFunc = 0;
    parseJSon(parseObj.body);
}

function parseReturnStatement(parseObj){
    callFromFunc = 1;
    mainTable.push(
        {
            'Line' : parseObj.loc.start.line,
            'Type' : parseObj.type,
            'Name' :  '',
            'Condition' : '',
            'Value': statmentType[parseObj.argument.type](parseObj.argument)
        }
    );
    callFromFunc = 0;
}

function parseIfStatement(parseObj){
    assignType();
    callFromFunc = 1;
    mainTable.push( {
        'Line' : parseObj.loc.start.line,
        'Type' : typeState,
        'Name' :  '',
        'Condition' :  ''+ statmentType[parseObj.test.type](parseObj.test),
        'Value':''} );   
    callFromFunc = 0;
    parseJSon(parseObj.consequent);
    if (parseObj.alternate!=null){
        if (parseObj.alternate.type=='IfStatement'){
            elseifTrue = true;
            parseJSon(parseObj.alternate);
            elseifTrue=false;}
        else// if (parseObj.alternate.type!=undefined)
            elseHandler(parseObj);}
    else
        elseifTrue=false;}

function elseHandler(parseObj)
{
    callFromFunc = 1;
    mainTable.push(
        {
            'Line' : parseObj.alternate.loc.start.line,
            'Type' : 'ElseStatement',
            'Name' :  '',
            'Condition' : '',
            'Value':''
        }
    );
    callFromFunc = 0;
    parseJSon(parseObj.alternate);  
}

function assignType(){
    if (elseifTrue == true)
        typeState = 'ElseIfStatement';
    else
        typeState = 'IfStatemenet';
}

function parseIdentifier(parseObj){
    if (callFromFunc == 0)
    {
        callFromFunc = 1;
        mainTable.push(
            {
                'Line' : parseObj.loc.start.line,
                'Type' : parseObj.type,
                'Name' :  parseObj.name,
                'Condition' : '',
                'Value':''
            }
        );
        callFromFunc = 0;
    }
    else
        return parseObj.name;
}

function parseLiteral(parseObj){
    if (callFromFunc == 0)
    {
        callFromFunc = 1;
        mainTable.push(
            {
                'Line' : parseObj.loc.start.line,
                'Type' : parseObj.type,
                'Name' :  parseObj.value,
                'Condition' : '',
                'Value':''
            }
        );
        callFromFunc = 0;
    }
    else
        return parseObj.value;
}

function parseBinaryExpression(parseObj){
    if (callFromFunc == 0)
    {
        callFromFunc = 1;
        mainTable.push(
            {
                'Line' : parseObj.loc.start.line,
                'Type' : parseObj.type,
                'Name' :  '('+statmentType[parseObj.left.type](parseObj.left)+parseObj.operator+statmentType[parseObj.right.type](parseObj.right)+')',
                'Condition' : '',
                'Value':''
            }
        );
        callFromFunc = 0;
    }
    else
        return '('+statmentType[parseObj.left.type](parseObj.left)+parseObj.operator+statmentType[parseObj.right.type](parseObj.right)+')';
}

function parseVariableDeclarator(parseObj){
    var valDec = '';
    callFromFunc = 1;
    if (parseObj.init==null)
        valDec='null';
    else
        valDec=statmentType[parseObj.init.type](parseObj.init);
    mainTable.push(
        {
            'Line' : parseObj.loc.start.line,
            'Type' : parseObj.type,
            'Name' :  statmentType[parseObj.id.type](parseObj.id),
            'Condition' : '',
            'Value':valDec
        });
    callFromFunc = 0;
}


function parseUnaryExpression(parseObj){
    if (callFromFunc == 0)
    {
        callFromFunc = 1;
        mainTable.push(
            {
                'Line' : parseObj.loc.start.line,
                'Type' : parseObj.type,
                'Name' :  statmentType[parseObj.argument.type](parseObj.argument),
                'Condition' : '',
                'Value':''
            }
        );
        callFromFunc = 0;
    }
    else
        return statmentType[parseObj.argument.type](parseObj.argument);
}

function parseMemberExpression(parseObj){
    if (callFromFunc == 0)
    {
        callFromFunc = 1;
        mainTable.push(
            {
                'Line' : parseObj.loc.start.line,
                'Type' : parseObj.type,
                'Name' :  statmentType[parseObj.object.type](parseObj.object)+'['+statmentType[parseObj.property.type](parseObj.property)+']',
                'Condition' : '',
                'Value':''
            }
        );
        callFromFunc = 0;
    }
    else
        return statmentType[parseObj.object.type](parseObj.object)+'['+statmentType[parseObj.property.type](parseObj.property)+']';
}

function getUpdateVar(parseObj)
{
    if (parseObj.prefix==true)
        return parseObj.operator+statmentType[parseObj.argument.type](parseObj.argument);
    else
        return statmentType[parseObj.argument.type](parseObj.argument)+parseObj.operator;
}

function parseUpdateExpression(parseObj){
    if (callFromFunc == 0){
        callFromFunc = 1;
        mainTable.push(  {
            'Line' : parseObj.loc.start.line,
            'Type' : parseObj.type,
            'Name' : getUpdateVar(parseObj),
            'Condition' : '',
            'Value':''
        } );
        callFromFunc = 0;}
    else
        return getUpdateVar(parseObj);
}

function parseLogicalExpression(parseObj){
    if (callFromFunc == 0){
        callFromFunc = 1;
        mainTable.push(
            {
                'Line' : parseObj.loc.start.line,
                'Type' : parseObj.type,
                'Name' : '('+statmentType[parseObj.left.type](parseObj.left)+parseObj.operator+statmentType[parseObj.right.type](parseObj.right)+')',
                'Condition' : '',
                'Value':''
            }
        );
        callFromFunc = 0;}
    else
        return '('+statmentType[parseObj.left.type](parseObj.left)+parseObj.operator+statmentType[parseObj.right.type](parseObj.right)+')';
}

function parseCallExpression(parseObj){
    var funcArgs='';
    for(var i=0;i<parseObj.arguments.length;i++){
        if (i==0)
            funcArgs=funcArgs+statmentType[parseObj.arguments[i].type](parseObj.arguments[i]);
        else
            funcArgs=funcArgs+','+statmentType[parseObj.arguments[i].type](parseObj.arguments[i]);
    }
    if (callFromFunc == 0) {
        callFromFunc = 1;
        mainTable.push({
            'Line' : parseObj.loc.start.line,
            'Type' : parseObj.type,
            'Name' :  statmentType[parseObj.callee.type](parseObj.callee)+'('+funcArgs+')',
            'Condition' : '',
            'Value':'' });
        callFromFunc = 0; }
    else
        return statmentType[parseObj.callee.type](parseObj.callee)+'('+funcArgs+')';
}

function parseArrayExpression(parseObj){
    var arrArgs='';
    for(var i=0;i<parseObj.elements.length;i++)
    {
        if (i==0)
            arrArgs=arrArgs+statmentType[parseObj.elements[i].type](parseObj.elements[i]);
        else
            arrArgs=arrArgs+','+statmentType[parseObj.elements[i].type](parseObj.elements[i]);
    }
    return '['+arrArgs+']';
}

function parseObjectExpression(parseObj){
    var objArgs='';
    for(var i=0;i<parseObj.properties.length;i++)
    {
        if (i==0)
            objArgs=objArgs+statmentType[parseObj.properties[i].key.type](parseObj.properties[i].key);
        else
            objArgs=objArgs+','+statmentType[parseObj.properties[i].key.type](parseObj.properties[i].key);
    }
    return '{'+objArgs+'}';
}

function parseNewExpression(parseObj){
    var funcArgs='';
    for(var i=0;i<parseObj.arguments.length;i++)
    {
        if (i==0)
            funcArgs=funcArgs+statmentType[parseObj.arguments[i].type](parseObj.arguments[i]);
        else
            funcArgs=funcArgs+','+statmentType[parseObj.arguments[i].type](parseObj.arguments[i]);
    }
    return 'new '+statmentType[parseObj.callee.type](parseObj.callee)+'('+funcArgs+')';
}

export {parseCode};
export {parseJSon};
export {clearTable};
