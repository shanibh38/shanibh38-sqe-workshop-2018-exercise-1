import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {parseJSon} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let globalTable = parseJSon(parsedCode.body[0]);
        //var x= ( JSON.stringify(globalTable));
        let table = makeTable(globalTable);
        document.getElementById('showTable').innerHTML = table;
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});

function makeTable(myTable){
    var res = '<table border=1>';
    res+='<tr>';
    res+='<td>'+'Line'+'</td>';
    res+='<td>'+'Type'+'</td>';
    res+='<td>'+'Name'+'</td>';
    res+='<td>'+'Condition'+'</td>';
    res+='<td>'+'Value'+'</td>';
    res+='</tr>';
    for (var i=0; i<myTable.length;i++) {
        res+='<tr>';
        res+='<td>'+myTable[i]['Line']+'</td>';
        res+='<td>'+myTable[i]['Type']+'</td>';
        res+='<td>'+myTable[i]['Name']+'</td>';
        res+='<td>'+myTable[i]['Condition']+'</td>';
        res+='<td>'+myTable[i]['Value']+'</td>';
        res+='</tr>';    }
    res+='</table>';
    return res;
}