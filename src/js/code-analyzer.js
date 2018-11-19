import * as esprima from 'esprima';
import { parse } from 'url';

var mainTable = [];
var callFromFunc = false;
var elseifTrue = false;
var typeState = "";

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
}


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
}

function parsefunctionDeclaration(parseObj ){
    callFromFunc = true;
    mainTable.push( {
            'Line' : parseObj.loc.start.line,
            'Type' : parseObj.type,
            'Name' : statmentType[parseObj.id.type](parseObj.id),
            'Condition' : '',
            'Value': ''
        } );
    callFromFunc = false;
    for (var i=0;i<parseObj.params.length;i++) {
        callFromFunc = true;
        mainTable.push( {
                'Line' : parseObj.params[i].loc.start.line,
                'Type' : parseObj.params[i].type,
                'Name' : ""+ statmentType[parseObj.params[i].type](parseObj.params[i]),
                'Condition' : '',
                'Value': '',
            } );
        callFromFunc = false; }
    parseJSon(parseObj.body);}

function parseVariableDeclaration(parseObj){
    for (var i=0;i<parseObj.declarations.length;i++) {
        parseJSon(parseObj.declarations[i]);
    }
}

function parseExpressionStatement(parseObj){
    parseJSon(parseObj.expression);
}

function parseAssignmentExpression(parseObj){
    callFromFunc = true;
    mainTable.push(
        {
            'Line' : parseObj.loc.start.line,
            'Type' : parseObj.type,
            'Name' :  ""+ statmentType[parseObj.left.type](parseObj.left),
            'Condition' : '',
            'Value': ""+ statmentType[parseObj.right.type](parseObj.right),
        }
    );
    callFromFunc = false;
}

function parseWhileStatement(parseObj){
    callFromFunc = true;
    var test = parseObj.test;
    mainTable.push(
        {
            'Line' : parseObj.loc.start.line,
            'Type' : parseObj.type,
            'Name' : '',
            'Condition' : ""+ statmentType[parseObj.test.type](parseObj.test),
            'Value': '',
        }
    );
    callFromFunc = false;
    parseJSon(parseObj.body);
}

function forInit(parseObj)
{
    if (parseObj!=undefined){
        if (parseObj.type=="AssignmentExpression")
        {
            return statmentType[parseObj.left.type](parseObj.left)+parseObj.operator+ statmentType[parseObj.right.type](parseObj.right);
        }
        else if (parseObj.type=="VariableDeclaration")
        {
            var forInitVal=parseObj.kind+" ";
            for (var i=0;i<parseObj.declarations.length;i++)
            {
                forInitVal=forInitVal+statmentType[parseObj.declarations[i].id.type](parseObj.declarations[i].id)+"="+statmentType[parseObj.declarations[i].init.type](parseObj.declarations[i].init);
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
    callFromFunc = true;
    mainTable.push(
        {
            'Line' : parseObj.loc.start.line,
            'Type' : parseObj.type,
            'Name' : '',
            'Condition' : "(" +forInit(parseObj.init)+";"+statmentType[parseObj.test.type](parseObj.test)+";"+statmentType[parseObj.update.type](parseObj.update)+")",
            'Value' : ''
        }
    );
    callFromFunc = false;
    parseJSon(parseObj.body);
}

function parseReturnStatement(parseObj){
    callFromFunc = true;
    mainTable.push(
        {
            'Line' : parseObj.loc.start.line,
            'Type' : parseObj.type,
            'Name' :  '',
            'Condition' : '',
            'Value': statmentType[parseObj.argument.type](parseObj.argument)
        }
    );
    callFromFunc = false;
}

function parseIfStatement(parseObj){
    assignType(parseObj);
    callFromFunc = true;
    mainTable.push( {
            'Line' : parseObj.loc.start.line,
            'Type' : typeState,
            'Name' :  '',
            'Condition' :  ""+ statmentType[parseObj.test.type](parseObj.test),
            'Value':''
    } );   
    callFromFunc = false;
    parseJSon(parseObj.consequent);
    if (parseObj.alternate!=null){
        if (parseObj.alternate.type=='IfStatement'){
            elseifTrue = true;
            parseJSon(parseObj.alternate);
            elseifTrue=false;
        }
        else// if (parseObj.alternate.type!=undefined)
            elseHandler(parseObj)
    }
    else
        elseifTrue=false;
    };

function elseHandler(parseObj)
{
    callFromFunc = true;
    mainTable.push(
        {
            'Line' : parseObj.alternate.loc.start.line,
            'Type' : 'ElseStatement',
            'Name' :  '',
            'Condition' : '',
            'Value':''
        }
    );
    callFromFunc = false;
    parseJSon(parseObj.alternate);  
}

function assignType(parseObj)
{
        if (elseifTrue == true)
            typeState = 'ElseIfStatement';
        else
            typeState = 'IfStatemenet';
}

function parseIdentifier(parseObj){
    if (callFromFunc == false)
    {
        callFromFunc = true;
        mainTable.push(
            {
                'Line' : parseObj.loc.start.line,
                'Type' : parseObj.type,
                'Name' :  parseObj.name,
                'Condition' : '',
                'Value':''
            }
        );
        callFromFunc = false;
    }
    else
        return parseObj.name;
}

function parseLiteral(parseObj){
    if (callFromFunc == false)
    {
        callFromFunc = true;
        mainTable.push(
            {
                'Line' : parseObj.loc.start.line,
                'Type' : parseObj.type,
                'Name' :  parseObj.value,
                'Condition' : '',
                'Value':''
            }
        );
        callFromFunc = false;
    }
    else
        return parseObj.value;
}

function parseBinaryExpression(parseObj){
    if (callFromFunc == false)
    {
        callFromFunc = true;
        mainTable.push(
            {
                'Line' : parseObj.loc.start.line,
                'Type' : parseObj.type,
                'Name' :  "("+statmentType[parseObj.left.type](parseObj.left)+parseObj.operator+statmentType[parseObj.right.type](parseObj.right)+")",
                'Condition' : '',
                'Value':''
            }
        );
        callFromFunc = false;
    }
    else
        return "("+statmentType[parseObj.left.type](parseObj.left)+parseObj.operator+statmentType[parseObj.right.type](parseObj.right)+")";
}

function parseVariableDeclarator(parseObj){
    var valDec = "";
    //if (parseObj.id.length==undefined){
        callFromFunc = true;
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
        callFromFunc = false;
   // }
}

function parseUnaryExpression(parseObj){
    if (callFromFunc == false)
    {
        callFromFunc = true;
        mainTable.push(
            {
                'Line' : parseObj.loc.start.line,
                'Type' : parseObj.type,
                'Name' :  statmentType[parseObj.argument.type](parseObj.argument),
                'Condition' : '',
                'Value':''
            }
        );
        callFromFunc = false;
    }
    else
        return statmentType[parseObj.argument.type](parseObj.argument);
}

function parseMemberExpression(parseObj){
    if (callFromFunc == false)
    {
        callFromFunc = true;
        mainTable.push(
            {
                'Line' : parseObj.loc.start.line,
                'Type' : parseObj.type,
                'Name' :  statmentType[parseObj.object.type](parseObj.object)+"["+statmentType[parseObj.property.type](parseObj.property)+"]",
                'Condition' : '',
                'Value':''
            }
        );
        callFromFunc = false;
    }
    else
        return statmentType[parseObj.object.type](parseObj.object)+"["+statmentType[parseObj.property.type](parseObj.property)+"]";
}

function getUpdateVar(parseObj)
{
    if (parseObj.prefix==true)
        return parseObj.operator+statmentType[parseObj.argument.type](parseObj.argument);
    else
        return statmentType[parseObj.argument.type](parseObj.argument)+parseObj.operator;
}

function parseUpdateExpression(parseObj){
    if (callFromFunc == false){
        callFromFunc = true;
        mainTable.push(  {
                'Line' : parseObj.loc.start.line,
                'Type' : parseObj.type,
                'Name' : getUpdateVar(parseObj),
                'Condition' : '',
                'Value':''
            } );
        callFromFunc = false;}
    else
        return getUpdateVar(parseObj);
}

function parseLogicalExpression(parseObj){
    if (callFromFunc == false){
        callFromFunc = true;
        mainTable.push(
            {
                'Line' : parseObj.loc.start.line,
                'Type' : parseObj.type,
                'Name' : "("+statmentType[parseObj.left.type](parseObj.left)+parseObj.operator+statmentType[parseObj.right.type](parseObj.right)+")",
                'Condition' : '',
                'Value':''
            }
        );
        callFromFunc = false;}
    else
        return "("+statmentType[parseObj.left.type](parseObj.left)+parseObj.operator+statmentType[parseObj.right.type](parseObj.right)+")";
}

function parseCallExpression(parseObj){
    var funcArgs="";
    for(var i=0;i<parseObj.arguments.length;i++){
        if (i==0)
            funcArgs=funcArgs+statmentType[parseObj.arguments[i].type](parseObj.arguments[i]);
        else
            funcArgs=funcArgs+","+statmentType[parseObj.arguments[i].type](parseObj.arguments[i]);
    }
    if (callFromFunc == false) {
        callFromFunc = true;
        mainTable.push({
                'Line' : parseObj.loc.start.line,
                'Type' : parseObj.type,
                'Name' :  statmentType[parseObj.callee.type](parseObj.callee)+"("+funcArgs+")",
                'Condition' : '',
                'Value':'' });
        callFromFunc = false;
    }
    else
        return statmentType[parseObj.callee.type](parseObj.callee)+"("+funcArgs+")";
}

function parseArrayExpression(parseObj){
    var arrArgs="";
    for(var i=0;i<parseObj.elements.length;i++)
    {
        if (i==0)
            arrArgs=arrArgs+statmentType[parseObj.elements[i].type](parseObj.elements[i]);
        else
            arrArgs=arrArgs+","+statmentType[parseObj.elements[i].type](parseObj.elements[i]);
    }
    return "["+arrArgs+"]";
}

function parseObjectExpression(parseObj){
    var objArgs="";
    for(var i=0;i<parseObj.properties.length;i++)
    {
        if (i==0)
            objArgs=objArgs+statmentType[parseObj.properties[i].key.type](parseObj.properties[i].key);
        else
            objArgs=objArgs+","+statmentType[parseObj.properties[i].key.type](parseObj.properties[i].key);
    }
    return "{"+objArgs+"}";
}

function parseNewExpression(parseObj){
    var funcArgs="";
    for(var i=0;i<parseObj.arguments.length;i++)
    {
        if (i==0)
            funcArgs=funcArgs+statmentType[parseObj.arguments[i].type](parseObj.arguments[i]);
        else
            funcArgs=funcArgs+","+statmentType[parseObj.arguments[i].type](parseObj.arguments[i]);
    }
    return "new "+statmentType[parseObj.callee.type](parseObj.callee)+"("+funcArgs+")";
}

export {parseCode};
export {parseJSon};
export {clearTable};
