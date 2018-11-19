import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {parseJSon} from '../src/js/code-analyzer';
import {clearTable} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        let parsedCode = parseCode("let x=1;");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"VariableDeclarator","Name":"x","Condition":"","Value":1}]);
        assert.equal(actual,expected);
    });
    it('is parsing an empty function correctly', () => {
        clearTable();
        let parsedCode = parseCode("let x=a+4*5;");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"VariableDeclarator","Name":"x","Condition":"","Value":"(a+(4*5))"}]);
        assert.equal(actual,expected);
    });
    it('is parsing an empty function correctly', () => {
        clearTable();
        let parsedCode = parseCode("for(var i=0;i<4 && s>23;i++){};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"ForStatement","Name":"","Condition":"(var i=0;((i<4)&&(s>23));i++)","Value":""}]);
        assert.equal(actual,expected);
    });
    /*
    it('is parsing an empty function correctly', () => {
        clearTable();
        let parsedCode = parseCode("for(var i=0;i<4 && s>23;i++){};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify();
        assert.equal(actual,expected
        );
*/
    it('is parsing an empty function correctly', () => {
        clearTable();
        let parsedCode = parseCode("while(a>(4*func(2))){};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"WhileStatement","Name":"","Condition":"(a>(4*func(2)))","Value":""}]);
        assert.equal(actual,expected);
    });
    it('is parsing an empty function correctly', () => {
        clearTable();
        let parsedCode = parseCode("function binarySearch(X, V, n){ let low, high, mid;low = 0;high = n - 1;while (low <= high) { mid = (low + high)/2;if (X < V[mid])high = mid - 1; else if (X > V[mid]) low = mid + 1;else return mid;}return -1;};");
        let actual = JSON.stringify(parseJSon(parsedCode.body[0]));
        let expected = JSON.stringify([{"Line":1,"Type":"FunctionDeclaration","Name":"binarySearch","Condition":"","Value":""},{"Line":1,"Type":"Identifier","Name":"X","Condition":"","Value":""},{"Line":1,"Type":"Identifier","Name":"V","Condition":"","Value":""},{"Line":1,"Type":"Identifier","Name":"n","Condition":"","Value":""},{"Line":1,"Type":"VariableDeclarator","Name":"low","Condition":"","Value":"null"},{"Line":1,"Type":"VariableDeclarator","Name":"high","Condition":"","Value":"null"},{"Line":1,"Type":"VariableDeclarator","Name":"mid","Condition":"","Value":"null"},{"Line":1,"Type":"AssignmentExpression","Name":"low","Condition":"","Value":"0"},{"Line":1,"Type":"AssignmentExpression","Name":"high","Condition":"","Value":"(n-1)"},{"Line":1,"Type":"WhileStatement","Name":"","Condition":"(low<=high)","Value":""},{"Line":1,"Type":"AssignmentExpression","Name":"mid","Condition":"","Value":"((low+high)/2)"},{"Line":1,"Type":"IfStatemenet","Name":"","Condition":"(X<V[mid])","Value":""},{"Line":1,"Type":"AssignmentExpression","Name":"high","Condition":"","Value":"(mid-1)"},{"Line":1,"Type":"ElseIfStatement","Name":"","Condition":"(X>V[mid])","Value":""},{"Line":1,"Type":"AssignmentExpression","Name":"low","Condition":"","Value":"(mid+1)"},{"Line":1,"Type":"ElseStatement","Name":"","Condition":"","Value":""},{"Line":1,"Type":"ReturnStatement","Name":"","Condition":"","Value":"mid"},{"Line":1,"Type":"ReturnStatement","Name":"","Condition":"","Value":1}]);
        assert.equal(actual,expected );
    });

/*
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });*/
});
