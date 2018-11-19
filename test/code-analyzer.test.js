import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {parseJSon} from '../src/js/code-analyzer';
import {clearTable} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an VariableDec function correctly', () => {
        let parsedCode = parseCode("let x=1;");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"VariableDeclarator","Name":"x","Condition":"","Value":1}]);
        assert.equal(actual,expected);
    });
    it('is parsing an VariableDec&&BinaryExp function correctly', () => {
        clearTable();
        let parsedCode = parseCode("let x=a+4*5;");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"VariableDeclarator","Name":"x","Condition":"","Value":"(a+(4*5))"}]);
        assert.equal(actual,expected);
    });
    it('is parsing an For function correctly', () => {
        clearTable();
        let parsedCode = parseCode("for(var i=0;i<4 && s>23;i++){};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"ForStatement","Name":"","Condition":"(var i=0;((i<4)&&(s>23));i++)","Value":""}]);
        assert.equal(actual,expected);
    });
    it('is parsing an For function correctly', () => {
        clearTable();
        let parsedCode = parseCode("for(i=0;i<4 && s>23;i++){};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"ForStatement","Name":"","Condition":"(i=0;((i<4)&&(s>23));i++)","Value":""}]);
        assert.equal(actual,expected);
    });
    it('is parsing an For function correctly', () => {
        clearTable();
        let parsedCode = parseCode("for(;i<4 && s>23;i++){};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"ForStatement","Name":"","Condition":"(;((i<4)&&(s>23));i++)","Value":""}]);
        assert.equal(actual,expected);
    });
    it('is parsing an For function correctly', () => {
        clearTable();
        let parsedCode = parseCode("for(i;i<2;i++){};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"ForStatement","Name":"","Condition":"(i;(i<2);i++)","Value":""}]);
        assert.equal(actual,expected);
    });
    it('is parsing an Identifier function correctly', () => {
        clearTable();
        let parsedCode = parseCode("a;");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"Identifier","Name":"a","Condition":"","Value":""}]);
        assert.equal(actual,expected);
    });
    it('is parsing an Binary function correctly', () => {
        clearTable();
        let parsedCode = parseCode("1+2%d;");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"BinaryExpression","Name":"(1+(2%d))","Condition":"","Value":""}]);
        assert.equal(actual,expected);
    });
    it('is parsing an Literal function correctly', () => {
        clearTable();
        let parsedCode = parseCode("4;");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"Literal","Name":4,"Condition":"","Value":""}]);
        assert.equal(actual,expected);
    });
    it('is parsing an CallFunc function correctly', () => {
        clearTable();
        let parsedCode = parseCode("func(a,1+s,func(1));");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"Identifier","Name":"a","Condition":"","Value":""},{"Line":1,"Type":"BinaryExpression","Name":"(1+s)","Condition":"","Value":""},{"Line":1,"Type":"Literal","Name":1,"Condition":"","Value":""},{"Line":1,"Type":"CallExpression","Name":"func(undefined)","Condition":"","Value":""},{"Line":1,"Type":"CallExpression","Name":"func(undefined,undefined,undefined)","Condition":"","Value":""}]);
        assert.equal(actual,expected);
    });
    it('is parsing an LogicalExpression function correctly', () => {
        clearTable();
        let parsedCode = parseCode("a||b;");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"LogicalExpression","Name":"(a||b)","Condition":"","Value":""}]);
        assert.equal(actual,expected);
    });
    it('is parsing an UpdateExpression function correctly', () => {
        clearTable();
        let parsedCode = parseCode("++i;");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"UpdateExpression","Name":"++i","Condition":"","Value":""}]);
        assert.equal(actual,expected);
    });
    it('is parsing an MemberExpression function correctly', () => {
        clearTable();
        let parsedCode = parseCode("a[a+3];");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"MemberExpression","Name":"a[(a+3)]","Condition":"","Value":""}]);
        assert.equal(actual,expected);
    });
    it('is parsing an UnaryExpression function correctly', () => {
        clearTable();
        let parsedCode = parseCode("-1;");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"UnaryExpression","Name":1,"Condition":"","Value":""}]);
        assert.equal(actual,expected);
    });
    it('is parsing an Assign&Array function correctly', () => {
        clearTable();
        let parsedCode = parseCode("a = [\"a\",\"b\",\"c\"];");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"AssignmentExpression","Name":"a","Condition":"","Value":"[a,b,c]"}]);
        assert.equal(actual,expected);
    });
    it('is parsing an Object function correctly', () => {
        clearTable();
        let parsedCode = parseCode("x = {};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"{}"}]);
        assert.equal(actual,expected);
    });
    it('is parsing an MemberExp function correctly', () => {
        clearTable();
        let parsedCode = parseCode("N[a+3];");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"MemberExpression","Name":"N[(a+3)]","Condition":"","Value":""}]);
        assert.equal(actual,expected);
    });
    it('is parsing an NewExp function correctly', () => {
        clearTable();
        let parsedCode = parseCode("var x = new Object();");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"VariableDeclarator","Name":"x","Condition":"","Value":"new Object()"}]);
        assert.equal(actual,expected);
    });
    it('is parsing an Object function correctly', () => {
        clearTable();
        let parsedCode = parseCode("x = {a,b};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"AssignmentExpression","Name":"x","Condition":"","Value":"{a,b}"}]);
        assert.equal(actual,expected);
    });
    it('is parsing an New function correctly', () => {
        clearTable();
        let parsedCode = parseCode("var x = new Object(a, 3);");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"VariableDeclarator","Name":"x","Condition":"","Value":"new Object(a,3)"}]);
        assert.equal(actual,expected);
    });
    it('is parsing an empty function correctly', () => {
        clearTable();
        let parsedCode = parseCode("//comment");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([]);
        assert.equal(actual,expected);
    });
    it('is parsing an IfStatment function correctly', () => {
        clearTable();
        let parsedCode = parseCode("if(x<2){};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"IfStatemenet","Name":"","Condition":"(x<2)","Value":""}]);
        assert.equal(actual,expected);
    });
    
    it('is parsing an WhileStatement function correctly', () => {
        clearTable();
        let parsedCode = parseCode("while(a>(4*func(2))){};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"WhileStatement","Name":"","Condition":"(a>(4*func(2)))","Value":""}]);
        assert.equal(actual,expected);
    });
    it('is parsing an FunctionDeclatrion&If&While&all function correctly', () => {
        clearTable();
        let parsedCode = parseCode("function binarySearch(X, V, n){ let low, high, mid;low = 0;high = n - 1;while (low <= high) { mid = (low + high)/2;if (X < V[mid])high = mid - 1; else if (X > V[mid]) low = mid + 1;else return mid;}return -1;};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"FunctionDeclaration","Name":"binarySearch","Condition":"","Value":""},{"Line":1,"Type":"Identifier","Name":"X","Condition":"","Value":""},{"Line":1,"Type":"Identifier","Name":"V","Condition":"","Value":""},{"Line":1,"Type":"Identifier","Name":"n","Condition":"","Value":""},{"Line":1,"Type":"VariableDeclarator","Name":"low","Condition":"","Value":"null"},{"Line":1,"Type":"VariableDeclarator","Name":"high","Condition":"","Value":"null"},{"Line":1,"Type":"VariableDeclarator","Name":"mid","Condition":"","Value":"null"},{"Line":1,"Type":"AssignmentExpression","Name":"low","Condition":"","Value":"0"},{"Line":1,"Type":"AssignmentExpression","Name":"high","Condition":"","Value":"(n-1)"},{"Line":1,"Type":"WhileStatement","Name":"","Condition":"(low<=high)","Value":""},{"Line":1,"Type":"AssignmentExpression","Name":"mid","Condition":"","Value":"((low+high)/2)"},{"Line":1,"Type":"IfStatemenet","Name":"","Condition":"(X<V[mid])","Value":""},{"Line":1,"Type":"AssignmentExpression","Name":"high","Condition":"","Value":"(mid-1)"},{"Line":1,"Type":"ElseIfStatement","Name":"","Condition":"(X>V[mid])","Value":""},{"Line":1,"Type":"AssignmentExpression","Name":"low","Condition":"","Value":"(mid+1)"},{"Line":1,"Type":"ElseStatement","Name":"","Condition":"","Value":""},{"Line":1,"Type":"ReturnStatement","Name":"","Condition":"","Value":"mid"},{"Line":1,"Type":"ReturnStatement","Name":"","Condition":"","Value":1}]);
        assert.equal(actual,expected );
    });
});
