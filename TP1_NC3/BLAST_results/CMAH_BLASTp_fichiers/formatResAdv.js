/****functions overwritten from other .js files */

function setupOrganismSuggest(orgEntryElem) /****overwritten from blast.js */
{
    var defaultMessage = ($("suggestHint")) ? $("suggestHint").value : "Enter organism name or id--completions will be suggested";
    var suggestHint = $("qorganism").getAttribute("suggestHint");
    if(suggestHint) defaultMessage = suggestHint;
    jQuery(orgEntryElem).attr("placeholder",defaultMessage);     
}

function DisplayAlignFromDescription(elem) {//overwritten from formatRes.js
    trObj = jQuery(elem).closest('tr');
    var chkID = jQuery(trObj).find('input:checkbox.cb:first')[0].id;    
    if(!jQuery("#" + chkID)[0].checked) {
        jQuery("#" + chkID).click();
    }
    jQuery("#btnAlign").click();    
    var alnView = jQuery("#alignViewSelect").val();
    if (alnView == "Pairwise" || alnView == "PairwiseWithIdentities") {
        DisplayDynamicAlign(elem);
    }
    else {
        location.href = "#" + elem.getAttribute("seqID");        
    }    
}	

function goToDefLine(dtrID) {//***********overwritten from formatRes.js
    jQuery("#btnDescr").click();
}

function constructFormatParams(params) {//***********overwritten from formatRes.js
    var formatParams = "";

    if ($("queryList")) {
        formatParams += "&QUERY_INDEX=" + $("queryList")[$("queryList").selectedIndex].value;
    }
    formatParams +="&ADV_VIEW=on&SHOW_LINKOUT=on&MASK_CHAR=2&MASK_COLOR=1";
    
    formatParams += getHiddenFieldParamString("BUILD_NAME");
    formatParams += "&ALIGNMENT_VIEW=" + jQuery("#alignViewSelect").val();
    if(jQuery("#showCDSFeature").attr("checked")) {
        formatParams += "&SHOW_CDS_FEATURE=on";
    }    
    //Keep 60 for Pairwise for now
    formatParams += "&LINE_LENGTH=60";
    
    var serviceType = "";
    if ($("serviceType").value == "sra" || $("serviceType").value == "wgs") {
        serviceType = "sra";
    }
    else if ($("clientType").value.toUpperCase() == "TMSmart_restricted".toUpperCase()) {
        serviceType = "restricted";
    }
    if (serviceType != "") {
        formatParams += "&BOBJSRVC=" + serviceType;
    }

    if ($("currQuery").value != "") {
        formatParams += "&CURR_QUERY_ID=" + $("currQuery").value;
    }
    var formatOrg = "";
    if ($("entrezLimit") && $("entrezLimit").value != "") {
        formatOrg = "&FORMAT_ENTREZ_QUERY=" + encodeURIComponent($("entrezLimit").value);
    }
    if (formatOrg != "" && formatOrg.indexOf("txid") != -1) {
        formatParams += formatOrg;
    }

    params += formatParams;
    
    if (params.indexOf("FORMAT_ENTREZ_QUERY") != -1 && params.indexOf("USE_ALIGNDB") != -1) {
        params = params.replace("&USE_ALIGNDB=true", "");
    }
    if (jQuery("#filteredByAccType") && jQuery("#filteredByAccType")== "on" && params.indexOf("USE_ALIGNDB") != -1) {
        params = params.replace("&USE_ALIGNDB=true", "");
    }
    
    return params;
}
function initContentWidth() //overwritten from formatRes.js
{ 
}
function initWidth(seqID) { //overwritten from formatRes.js
}

function goToBlastAlign(e, seqID, winname) {//overwritten from taxformat.js               
    dispAlignForSeqID(seqID);
    utils.preventDefault(e);
}

function goToOrgReport(e, taxid) //overwritten from taxformat.js
{
    jQuery("#btnTaxOrg").click();    
    location.href = "#" + taxid;        
    utils.preventDefault(e);
}

function InitFormatPage() /***overwritten from format.js**/
{
    
    LimitByHitlistSize($("FRM_DESCRIPTIONS"));        
        
    jQuery("#FRM_DESCRIPTIONS").bind("change",submitFormatForm);    
    jQuery("#alignViewSelect").bind("change",ReadAlignRequest);    
    jQuery("#showCDSFeature").bind("click",ReadAlignRequest); 
    jQuery("#lineLength").bind("change",ReadAlignRequest); 
    jQuery("#alignViewSelect").bind("change",SaveFormatOptions);    
    jQuery("#showCDSFeature").bind("change",SaveFormatOptions);    
    jQuery("#lineLength").bind("change",SaveFormatOptions);  
    jQuery("#resetFormOpts").bind("click",resetFormatOptions);  
    jQuery("#resetFormOpts").bind("click",SaveFormatOptions);      
    if(jQuery("#phiPtInd")[0]) jQuery("#phiPtInd").bind("change",submitFormatForm);     
}

function initDescDownLoad() {/***overwritten from formatRes.js**/

    jQuery("#dsDownload").find("a[name=dwn]").each(function(index) {                
        jQuery(this).bind("click", function (e) { submitDownLoad(this, true); jQuery("#btnDwnld").click();});    
    });        
    jQuery("#dsDownload").find("a[name=dwn_clust]").each(function(index) {                
        jQuery(this).bind("click", function (e) { initDownLoadClustMulti(this); jQuery("#btnDwnld").click();});    
    });        
    
    jQuery("#dsDownloadAln").find("a").each(function(index) {                
        jQuery(this).bind("click", function (e) { submitDownLoad(this, true); jQuery("#btnDwnldAln").click();});
    });        
    jQuery("#dscTable,#dscTable_psiw").find("td.c6 div.popDl a.clustDnld,td.c6 div.popDl button.clustDnld").each(function(index) {                
        jQuery(this).bind("click", function (e) {             
            if(jQuery(this).attr("extTool")) {
                initDownloadClust(this);
            }
            else {
                submitDownLoad(this, false);
            }
            jQuery(this).closest("span").find("button")[0].click();
            utils.preventDefault(e);
        });
    });            
}


function addDwnlParams()
{
    var addParams = "";
    var alnView = jQuery("#alignViewSelect").val();
    var queryAnchView = !(alnView == "Pairwise" || alnView == "PairwiseWithIdentities");

    addParams = "&RID=" +  jQuery("#Rid").val() + "&ALIGNMENT_VIEW=" + jQuery("#alignViewSelect").val() ;
    if(queryAnchView) {
        addParams += "&LINE_LENGTH=" + jQuery("#lineLength").val();
        $("selDnSeqs").value = collectSelectedSeqs("dscTable",false);
    }    
    else {
        if(jQuery("#showCDSFeature").attr("checked")) {
            addParams +="&SHOW_CDS_FEATURE=on";
        }    
    }
    if(jQuery("#psiIthresh")[0]) {
        addParams +="&I_THRESH=" + jQuery("#psiIthresh").val();
    }
    if(jQuery("#queryIndex")[0]) {
        addParams +="&QUERY_INDEX=" + jQuery("#queryIndex").val();
    }      
    if(jQuery("#cfcDsSave")[0] && jQuery("#cfcDsSave").val() != "") {        
        configDescr = "";
        var configCols = jQuery("#cfcDsSave").val().split(",");
        for (i = 0; i< configCols.length; i++) {
            if(isColHidden(configCols[i])) {            
                continue;
            }
            if (configDescr != "") configDescr += ",";
            configDescr += configCols[i];
        }                
        addParams +="&CONFIG_DESCR=" + configDescr;
    }
    if ($("entrezLimit") && $("entrezLimit").value != "") {
        addParams += "&FORMAT_ENTREZ_QUERY=" + encodeURIComponent($("entrezLimit").value);
    }   
     
    return addParams;
}

function isColHidden(colValue)
{
    var ret = false;
    jQuery("#dsConfig").find("input[type='checkbox'").each(function(index) {        
        if(jQuery(this).val() == colValue) {
            ret =  jQuery(this).parent().hasClass("hidden") ? true : false;
            return false;
        }            
    });    
    return ret;
}

function initSelectAll(elemID)
{   
    var suffix = PsiBelowThresh(elemID);
    elemID += suffix;
    slcNumID = "slcNum" + suffix;
    jQuery("#" + elemID).bind("click", function(e) {            
        if(parseInt(jQuery("#" + slcNumID).html()) > 0) {
            g_ReIndexDescriptions = true;
        }
        ncbi.sg.ping(this, "click", this.checked ? "checked=true" : "checked=false");        
    });                        
}

function areAllSeqsChecked()
{
    var allChecked = false;
    allChecked = jQuery("#select-all")[0].checked;
    if (allChecked && $("psiw") && utils.hasClass($("psiw"), "shown")) {
        allChecked = jQuery("#select-all_psiw")[0].checked;
    }
    return allChecked;
}

function initDescSelect() /***overwritten from formatRes.js**/
{
    jQuery("#select-all,#select-all_psiw").bind("click", configDescrSelect);
    
    jQuery("#descTblCtrl").find("a[view]").each(function(index) {
        jQuery(this).bind("click", DisplaySelectedView);
    });
    
    var checkedSeqs = jQuery("#checkedSeqs").val()   
    if(checkedSeqs == "") {
        jQuery("#select-all").click(); 
        jQuery("#select-all_psiw").click(); 
    }
    else {
        checkedSeqs = checkedSeqs.split(",");
        jQuery("#dscTable,#dscTable_psiw").find("input.cb").each(function(index) {
            trObj = jQuery(this).closest('tr');    
            ind = jQuery(trObj[0]).attr("ind");
            currSeqID = jQuery(jQuery("#deflnDesc_" + ind)[0]).attr("seqFSTA");        
            if(checkedSeqs.indexOf(currSeqID) != -1) {
                jQuery(this).click();
            }            
        });        
    }

}


function configDescrColumns(e,btn,dlgId) /***overwritten from formatRes.js**/
{
    var suffix = PsiBelowThresh(dlgId);    
    var colmnsInfId = "cfcDsInf" + suffix;        
    $(colmnsInfId).value = "";        
    jQuery("#" + dlgId).find("input[type='checkbox']").each(function(index) {         
        if(this.checked) {            
            if ($(colmnsInfId).value != "") $(colmnsInfId).value += ",";
            $(colmnsInfId).value += jQuery(this).val();
        }
    });  
    saveConfigDescrColumns(colmnsInfId);        
}


function showHideDescrTableCol(tblID, confgiCheckBox, hide) { /***overwritten from formatRes.js**/
    //tblID = "dscTable"    
    var columnIndex = jQuery(confgiCheckBox).val();
    columnIndex = jQuery.isNumeric(columnIndex) ? parseInt(columnIndex) : jQuery("#" + tblID).find("th[name='"+ columnIndex + "']").index() + 1;    
    
    if(columnIndex) {
        showHideCol(tblID, columnIndex, hide);        
        if ($("psiw") && utils.hasClass($("psiw"), "shown")) {
            showHideCol(tblID + "_psiw", columnIndex, hide);
        }
    }
}

function collectSelectedSeqs(tblID,getGi) {    /***overwritten from formatRes.js**/
    //tblID = "dscTable"
    var seqList = createSelseqString(tblID,getGi);    
    if ($("psiw") && utils.hasClass($("psiw"), "shown")) {        
        var seqListPsi = createSelseqString(tblID + "_psiw",getGi);
        if(seqList != "") {
            if(seqListPsi != "") seqList += "," + seqListPsi;
        } 
        else  seqList = seqListPsi;            
    }
    
    return seqList;
}
function collectSelectedAccs(tblID, elem) { /***overwritten from formatRes.js**/
    //tblID = "dscTable"
    var seqList = createSelseqStringAccs(tblID, elem);
    if ($("psiw") && utils.hasClass($("psiw"), "shown")) {
        var seqListPsi = createSelseqStringAccs(tblID + "_psiw", elem);
        if(seqList != "") {
            if(seqListPsi != "") seqList += "," + seqListPsi;
        } 
        else  seqList = seqListPsi;
    }
    return seqList;
}

function getAllSelectedSeqsNumber()
{
    var currSelNum = parseInt(jQuery("#slcNum").html());
    var currSelNumPSI = 0;
    if ($("psiw") && utils.hasClass($("psiw"), "shown")) {
        currSelNumPSI = parseInt(jQuery("#slcNum_psiw").html());
    }
    currSelNum += currSelNumPSI;        
    return currSelNum;
}

function enableDescrLinks(selNum, toolbarID, selElID) {
    $(selElID).innerHTML = selNum;// table seqs
    var allSelNum = getAllSelectedSeqsNumber();
    jQuery("#tabDescr").find("#descTblCtrl a[minSlct],#btnDwnld").each(function (index) {//All seqs 
        enableLinkForSelectedSeq(allSelNum, this);         
    });
    if(jQuery("#slcNumAll")[0]) {
        jQuery("#slcNumAll").html(allSelNum);
    }    
    //The next is for all seqs
    jQuery("#mainCont").find("#taxSelseqs span.slcNum, #alignView ul.selctall span.slcNum, #grapArea ul.selctall span.slcNum").each(function(index) {
        jQuery(this).html(allSelNum);
    });    
    var countUnchecked = jQuery("#dscTable").find("input.cb:not(:checked)").length;
    if (countUnchecked > 0) {
        if(jQuery("#select-all")[0].checked) {
            jQuery("#select-all")[0].checked = false;
        }    
    }
    countUnchecked = jQuery("#dscTable_psiw").find("input.cb:not(:checked)").length;
    if (countUnchecked > 0) {
        if(jQuery("#select-all_psiw")[0].checked) {
            jQuery("#select-all_psiw")[0].checked = false;
        }    
    }    
}


function getHTMLTextWidth(textElem) {
    var elemText = jQuery(textElem).html();    
    var html_calc = jQuery('<span>' + elemText + '</span>');
    jQuery(html_calc).css('font-size', jQuery(textElem).css('font-size')).hide();
    jQuery(html_calc).css('font-weight', jQuery(textElem).css('font-weight'));
    jQuery(html_calc).prependTo('body');
    var width = jQuery(html_calc).width();
    jQuery(html_calc).remove();
    return width;
}

/********************Filter results functions******* */
function InitFilerOrg()
{
    setupOrganismSuggest($("filterResults").FORMAT_ORGANISM);
    if ($("addOrg")) utils.addEvent($("addOrg"), "click", AddFormatOrgField, false);
    jQuery("#btnFilter").bind("click",filterResults);    
    jQuery("#btnReset").bind("click", function(e) {                    
        resetFilterRes();
        submitFormatFormFltRes(e);                
    });                         
}


function submitFormatForm(e)
{
    modifySubmitResultsParams(this);    
    $("results").submit();
    utils.preventDefault(e);
}


function modifySubmitFormatParams(submitElem) 
{
    var val;
    var elemType = jQuery(submitElem).attr("type");    
    var elemName = jQuery(submitElem).attr("name");        
    if(typeof(elemName) == "undefined") return;
    if (elemType == "checkbox") {
        val = (submitElem.checked) ? "on" : "";
    }    
    else {        
        val = jQuery(submitElem).val();    
    }
        
    var append = val ? true : false;
    jQuery($("results")).find("input[name='" + elemName + "']").each(function (index) {        
        append = false;
        if(!val) {
            jQuery(this).remove();
        }
        else {
            this.value = val;     
        }
        //console.log("FOUND: " + submitElem.name + " " + submitElem.value + " value=" + this.value);
    });
    
    if (append) {        
        elem = document.createElement("input");
        jQuery(elem).attr("type", "hidden");
        jQuery(elem).attr("name", elemName);
        jQuery(elem).val(val);                    
        $("results").appendChild(elem);   
        //console.log("APPEND: " + submitElem.name + " " + submitElem.value + " value=" + elem.value);                         
    }    
    
}
//Use to submit next PSI-BLAST iteration
function mergeFormsToSubmit(formInput, formToSubmit) 
{
    jQuery("#" + formInput).find("input").each(function (index) {
        var elemName = jQuery(this).attr("name");
        var elemValue = jQuery(this).attr("value");
        var found = false;
        jQuery("#" + formToSubmit).find("input[name='" + elemName + "']").each(function (index) {
            this.value = elemValue;
            found = true;
        });
        
        if (!found) {
            jQuery("#" + formToSubmit).append(this);
        }
        
    }); 
    
    jQuery("#" + formToSubmit).attr("action","Blast.cgi");           
    var elemsToRemove = "input[name='getSeqGi']";
    if(jQuery("#clusterDB")[0] && jQuery("#clusterDB").val() == "clustdb") {        
        elemsToRemove += ",input[name='clustMemList'],input[name='blast2SeqRID'],input[name='cobaltRID']";
    }    
    jQuery("#" + formToSubmit).find(elemsToRemove).each(function (index) {    
        jQuery(this).remove();
    });    
    jQuery("#" + formToSubmit).submit();    
}

function validateFormatFilters()
{
    var valid = false;
    jQuery("#filterResults").find("input[type=text]").each(function (index) {
        if(jQuery(this).val() != "") {            
            valid = true;
        }
    });    
    if(!valid) {
        if(jQuery("#runPSIBlast")[0]) {
            if( (jQuery("#runPSIBlast")[0].checked && !jQuery("#origRunPSIBlast").attr("checked")) ||
            (!jQuery("#runPSIBlast")[0].checked && jQuery("#origRunPSIBlast").attr("checked")) )
            valid = true;
        }
    }
    if(!valid) {
        alert("Please, enter filtering paramteres");
    }
    else {
    var prcLow = jQuery("#prcLow").val();
    var prcHigh = jQuery("#prcHigh").val();    
    if(isNaN(prcLow) || isNaN(prcHigh)) {
        alert("Invalid Percent Identity entered");
        valid = false;
    }    
    else if(prcLow > 100 || prcLow < 0 || prcHigh > 100 || prcHigh < 0) {                        
        alert("Please, enter numbers between 0 and 100 for Percent Identity value ");
        valid = false;
    } 
    else if(parseFloat(prcLow) > parseFloat(prcHigh)) {            
        jQuery("#prcLow").val(prcHigh);
        jQuery("#prcHigh").val(prcLow);
    }
    if(valid) {
        var expLow = jQuery("#expLow").val();
        var expHigh = jQuery("#expHigh").val();    
        if(isNaN(expLow) || isNaN(expHigh) || expLow < 0 || expHigh < 0) {    
            alert("Invalid expect value entered");
            valid = false;
        }      
        else if(parseFloat(expLow) > parseFloat(expHigh)) {    
            jQuery("#expLow").val(expHigh);
            jQuery("#expHigh").val(expLow);
        }
    }     
    if(valid) {
        var qcLow = jQuery("#qcLow").val();
        var qcHigh = jQuery("#qcHigh").val();    
        if(isNaN(qcLow) || isNaN(qcHigh)) {
            alert("Invalid Query Coverage entered");
            valid = false;
        }    
        else if(qcLow > 100 || qcLow < 0 || qcHigh > 100 || qcHigh < 0) {                        
            alert("Please, enter numbers between 0 and 100 for Query Coverage value ");
            valid = false;
        } 
        else if(parseInt(qcLow) > parseInt(qcHigh)) {            
            jQuery("#qcLow").val(qcHigh);
            jQuery("#qcHigh").val(qcLow);
        }      
    }              
}
    return valid;
}    

function filterResults(e)
{
    var validFilters = validateFormatFilters();    
    if(!validFilters) {
        return false;
    }
    submitFormatFormFltRes(e);
}
function submitFormatFormFltRes(e)
{
    jQuery($("results")).find("input[name*='FORMAT_ORGANISM']").each(function (index) {
        jQuery(this).remove();
    });

    jQuery($("results")).find("input[name*='FORMAT_ORG_EXCLUDE']").each(function (index) {        
        jQuery(this).remove();
    });
    jQuery($("results")).find("input[name='FORMAT_EQ_MENU']").each(function (index) {        
        jQuery(this).remove();
    });
    jQuery($("results")).find("input[name='FORMAT_ENTREZ_QUERY']").each(function (index) {        
        jQuery(this).remove();
    });
    jQuery($("results")).find("input[name='PERC_IDENT_LOW']").each(function (index) {        
        jQuery(this).remove();
    });
    jQuery($("results")).find("input[name='PERC_IDENT_HIGH']").each(function (index) {        
        jQuery(this).remove();
    });
    jQuery($("results")).find("input[name='EXPECT_LOW']").each(function (index) {        
        jQuery(this).remove();
    });
    jQuery($("results")).find("input[name='EXPECT_HIGH']").each(function (index) {        
        jQuery(this).remove();
    });
    jQuery($("results")).find("input[name='I_THRESH']").each(function (index) {        
        jQuery(this).remove();
    });
    jQuery($("results")).find("input[name='RUN_PSIBLAST']").each(function (index) {        
        jQuery(this).remove();
    });
        
    jQuery("#filterResults").find("input").each(function (index) {
        modifySubmitFormatParams(this);
    });    
    $("results").submit();
    utils.preventDefault(e);
}

function resetFilterRes()
{
    jQuery("#prcLow").val("");
    jQuery("#prcHigh").val("");
    jQuery("#expLow").val("");
    jQuery("#expHigh").val("");
    jQuery("#qcLow").val("");
    jQuery("#qcHigh").val("");
    jQuery("#qorganism").val("");    
    jQuery("#orgExcl").attr('checked', false)
    jQuery("#orgs").html("");
    jQuery("#numOrg").val("1");    
    jQuery($("results")).find("input[name='SORTED_DESCR_SEQS']").each(function (index) {        
        jQuery(this).remove();
    });
    jQuery($("results")).find("input[name='CHECKED_SEQS']").each(function (index) {        
        jQuery(this).remove();
    });
    jQuery("#sortBy").val("");
    //resetOrganismControls($("filterResults").FORMAT_ORGANISM);	
    return false;    
}

/********************Filter results functions end******* */

/***********************************functions for re-indexing descriptions */
function reIndexDescriptions()
{
    alnView = jQuery("#alignViewSelect").val();        
    var checkedSeqs = jQuery("#dscTable,#dscTable_psiw").find("input.cb:checked");
    var indexChange = false;
    checkedSeqs.each(function(index) {
        trObj = jQuery(this).closest('tr');
        jQuery(trObj).removeClass("noprint");
        //ad first five alignments        
        reindexed = reIndexTheRow(trObj, index);                        
        if(reindexed) indexChange = true;
        if(reindexed && index < 5) {
            jQuery("#btnAlign").attr("reloadFirstBatch","on");                
        }
    });
    if(!indexChange && checkedSeqs.length < 5) {
        jQuery("#btnAlign").attr("reloadFirstBatch","on");
    }

    jQuery("#btnAlign").attr("reload","ExecAlignRequest");
    jQuery("#btnGrph").attr("reload","ExecGraphAlinRequest");
    jQuery("#btnTaxn").attr("reload","ExecTaxonomyRequest");

    jQuery("#dscTable,#dscTable_psiw").find("input.cb:not(:checked)").each(function(index) {
        trObj = jQuery(this).closest('tr');        
        jQuery(trObj).addClass("noprint");
        resetRowIndexes(trObj);        
    });  
    g_ReIndexDescriptions = false;
}

function reIndexTheRow(trObj,index)
{
    reindexed = false;
    index++;
    var ind = jQuery(trObj).attr("ind");
    if(ind) {
        ind = parseInt(ind);
    }
    if(!ind || ind != index) {            
        jQuery(trObj).attr("ind","" + index);
        var deflDescr = jQuery(trObj).find('a.deflnDesc:first')[0];    
        jQuery(deflDescr).attr("ind","" + index);
        jQuery(deflDescr).attr("id","deflnDesc_" + index);    
        jQuery(deflDescr).removeAttr("stat");    
        reindexed = true;
    }
    return reindexed;
}

function resetRowIndexes(trObj,index)
{
    jQuery(trObj).removeAttr("ind");
    var deflDescr = jQuery(trObj).find('a.deflnDesc:first')[0];    
    jQuery(deflDescr).removeAttr("ind");
    jQuery(deflDescr).removeAttr("id");    
    jQuery(deflDescr).removeAttr("stat");
}

function resetGlobals(leaveFirstAligns)
{
    g_DisableAutoCheck = false;
    g_autoStartIdx = new Array();
    g_autoStopIdx = new Array();
    g_alignViewPos = 0;                
    if(jQuery("#btnAlign").attr("reloadFirstBatch")) {
        g_MaxReadMessageIndex = 0; //alnShow_idx with the message, deflnDesc_idx with stat="read"
        g_MaxDisplayedIndex = 0; //deflnDesc_idx with stat="disp" - last one in the set of N            
        g_DisplayeAlignsRanges = ""; //String in the format start1-stop1,start2-stop2...
    }
    else {            
        var ranges = g_DisplayeAlignsRanges.split(",");
        if(ranges.length) {
            var indexes = ranges[0].split("-");        
            g_MaxReadMessageIndex = indexes[0];
            g_MaxDisplayedIndex   = indexes[1];
            g_DisplayeAlignsRanges = ranges[0];

            g_autoStartIdx.push(indexes[0]); //1,20,25
            g_autoStopIdx.push(indexes[1]);  //4,24,29        
        }            
    }
}    

/********************end functions for re-indexing descriptions */
function SaveFormatOptions() {
    blastUrl = "fmtsave.cgi";

    var rp = new RemoteDataProvider(blastUrl);

    rp.onSuccess = function(obj) {
        //console.log();    
    };
    rp.onError = function(obj) {
        console.log("fmtsave.cgi: Error saving " + this.name + " configuration");
    }    
    
    var rid = getHiddenFieldVal("RID");    
    var paramVal,formatparams;
    if (this.id == "resetFormOpts") {
        formatparams = "ALIGNMENT_VIEW=Pairwise&SHOW_CDS_FEATURE=false&LINE_LENGTH=60";
    }
    else {
        if(this.type == "checkbox") {
            paramVal = this.checked;
        }
        else {
            paramVal = jQuery(this).val();
        }
        formatparams = this.name + "=" + paramVal;
    }
        
    var params = "CMD=Get&RID=" + rid + "&UPDATE_RES_OPTS=on&" + formatparams;    
    rp.Request(params,"POST");
}

function IsQueryAnchoredView()
{
    var alnView = jQuery("#alignViewSelect").val();
    var queryAnchView = !(alnView == "Pairwise" || alnView == "PairwiseWithIdentities");
    return queryAnchView;
}

function ExecAlignRequest(e)
{    
    alnView = jQuery("#alignViewSelect").val();
    var queryAnchView = !(alnView == "Pairwise" || alnView == "PairwiseWithIdentities");
    if(queryAnchView || jQuery("#btnAlign").attr("reloadFirstBatch")) {                    
         ReadAlignRequest(e);                        
         jQuery("#btnAlign").removeAttr("reloadFirstBatch");                                            
    }
    else {//remove all alignments except first batch                    
        jQuery("#alignments").find("div.alnMsg").each(function(index) {
            if(index !=0) {
                jQuery(this).remove();
            }
        });
        //remove stat for all alignments except first batch (index 0-4)                   
        jQuery("#dscTable,#dscTable_psiw").find("a[stat].deflnDesc").each(function(index) {
            if(index > 4) {
                jQuery(this).removeAttr("stat");        
            }
        });        
    }
 }
    
 function ExecGraphAlinRequest(e)
 {
    jQuery("#grBlastHits").find("div.grpos").each(function(index) {        
        jQuery(this).remove();        
    });     
    jQuery("#actOvrvNumSp").html("");        
    jQuery("#ovrvNumSp").html("");           
    ReadGraphAlinRequest(e);
 }

function ExecTaxonomyRequest(event) {
    blastUrl = "t2g.cgi";

    var rp = new RemoteDataProvider(blastUrl);

    rp.onSuccess = function (obj) {        

        jQuery("#taxReport").html(obj.responseText);                           
        jQuery("#taxTable").find(".jtg").each(function (index) {
            jQuery(this).bind("click", toggleTaxRow);
                
        });
        jQuery("#btnTaxLinage").click(); 
        
    };
    rp.onError = function (obj) {                
        jQuery("#taxLinageRep").html("Error loading taxonomy reports");        
    }
    var params = constructTaxURLParams();    
    jQuery("#taxLinageRep").html("Loading...");
    rp.Request(params);
    if(event) utils.preventDefault(event);
}

function ReadQueryAnchAlignRequest(event) {
    blastUrl = "t2g.cgi";

    
    var rp = new RemoteDataProvider(blastUrl);

    rp.onSuccess = function (obj) {        
    
        jQuery("#alignView").html(obj.responseText);                                   
        initAlignAnchoredSet(); 
        initQueryAnchoredScrolling();        
    };
    rp.onError = function (obj) {
        jQuery("#alignView").html("Error loading query-anchored alignment");                                           
    }
        
    var alnView = jQuery("#alignViewSelect").val();
    //params = "CMD=Get&RID=" + getHiddenFieldVal("RID") + "&ADV_VIEW=on&FORMAT_OBJECT=Alignment&ALIGNMENT_VIEW=" + alnView + "&ALIGNMENTS=" + getHiddenFieldVal("DESCRIPTIONS") +
    //             "&DESCRIPTIONS=0&NUM_OVERVIEW=0&SHOW_OVERVIEW=no&QUERY_ANCHORED_DYNAMIC=on";   
    var params = constructGenURLParams();                 
    params += "&FORMAT_OBJECT=Alignment&ALIGNMENT_VIEW=" + alnView + "&ALIGNMENTS=" + getHiddenFieldVal("DESCRIPTIONS") + "&DESCRIPTIONS=0&NUM_OVERVIEW=0&SHOW_OVERVIEW=no&QUERY_ANCHORED_DYNAMIC=on";
    params += "&LINE_LENGTH=" + jQuery("#lineLength").val();
    params = params.replace("&DYNAMIC_FORMAT=on","");
    rp.Request(params);
    jQuery("#alignView").html("Loading query-anchored alignment...");
    if(event) utils.preventDefault(event);
}

function initAlignAnchoredSet() 
{
    var divHdrArray = jQuery("#queryAnchView").find("div.alnHdr");
    jQuery("#alnHdr_" + divHdrArray.length + " a.navNext,#alnHdr_1 a.navPrev,#alnHdr_1 a.navBack ").attr("disabled","disabled");               
    divHdrArray.each(function(index) {
        jQuery(this).find("a.dnld").each(function(index) {
            jQuery.ui.jig.scan(this); // init dynamic popper
        });        
        jQuery(this).find("a.dnld").each(function() {
            jQuery.ui.jig.scan(this); // init dynamic popper
            var dwnDialogID = jQuery(this).attr("href");
            jQuery(dwnDialogID).find("button").each(function() {        
                jQuery(this).bind("click", execDownLoad);        
            });            
            jQuery(dwnDialogID).bind("click", function(e) { e.stopPropagation(); });                        
        });        
    });            
}


function initQueryAnchoredScrolling()
{
    jQuery("#queryAnchView").find("pre.rwd").each(function(index) {
        initOneQueryAnchoredRowSet(this);        
    });         
}

function initOneQueryAnchoredRowSet(preElem)
{
    var topScrollId = jQuery(preElem).attr("topScroll");
    if(jQuery(preElem)[0].scrollWidth > jQuery("#alignments").width()) {        
        jQuery("#" + topScrollId + " div").width(jQuery(preElem)[0].scrollWidth);
        jQuery("#" + topScrollId).show();       
        
        jQuery(preElem).scroll(function(){    
            jQuery("#" + topScrollId).scrollLeft(jQuery(preElem).scrollLeft());
        });
        
        jQuery("#" + topScrollId).scroll(function(){
            jQuery(preElem).scrollLeft(jQuery("#" + topScrollId).scrollLeft());            
        });            
    }     
    else {
        
        jQuery("#" + topScrollId).hide();
    }    
}

function getCheckedSeqList()
{
    var seqList = "";                 
    jQuery("#dscTable,#dscTable_psiw").find("input.cb:checked").each(function(index) {
        trObj = jQuery(this).closest('tr');    
        ind = jQuery(trObj[0]).attr("ind");
        currSeqID = jQuery(jQuery("#deflnDesc_" + ind)[0]).attr("seqFSTA");        
        if (seqList != "") seqList += ",";
        seqList += currSeqID;
    });        
    return seqList;                 
}

function getCheckedHspNum()
{
    var totalHsp = 0;                 
    jQuery("#dscTable,#dscTable_psiw").find("input.cb:checked").each(function(index) {
        trObj = jQuery(this).closest('tr');    
        ind = jQuery(trObj[0]).attr("ind");
        hspNum = jQuery(jQuery("#deflnDesc_" + ind)[0]).attr("hsp");        
        totalHsp += parseInt(hspNum);        
    });        
    return totalHsp;                 
}

function setAdvViewGraphNums()
{
    jQuery("#actOvrvNumSp").html(getAllSelectedSeqsNumber());    
    if(areAllSeqsChecked()) {    
        jQuery("#ovrvNumSp").html(getCheckedHspNum());                
    }
    else if (jQuery("#ovrvNum")[0]) {        
        jQuery("#ovrvNumSp").html(jQuery("#ovrvNum").val());
    }    
}

//RID=0X254177014&QUERY_NUMBER=0&FORMAT_OBJECT=TaxBlast&FORMAT_TYPE=HTML&CLIENT=web&SERVICE=plain&ALIGNMENT_VIEW=Pairwise&EXPECT=10&DESCRIPTIONS=100&ALIGNMENTS=100&LINE_LENGTH=60&NUM_OVERVIEW=100&COMPOSITION_BASED_STATISTICS=0&SHOW_OVERVIEW=yes&SHOW_LINKOUT=yes&GET_SEQUENCE=yes&MASK_CHAR=2&MASK_COLOR=1&PAGE=MegaBlast&FORMAT_PAGE_TARGET=&RESULTS_PAGE_TARGET=&STEP_NUMBER=&I_THRESH=&WWW_BLAST_TYPE_URL=&AUTO_FORMAT=&FIRST_QUERY_NUM=0&DISPLAY_SORT=0&DATABASE_SORT=0&HSP_SORT=0&QUERY_INDEX=0&DYNAMIC_FORMAT=on&USE_ALIGNDB=true&ALIGNDB_WHERE_CLAUSE=seq_evalue%20is%20not%20null&ALIGNDB_ORDER_CLAUSE=seq_evalue%20asc,aln_id%20asc&ALIGNDB_BATCH_ID=483364482&ALIGNDB_MASTER_ALIAS=SD_ALIGNDB_MASTER&ALIGNDB_CGI_HOST=blast.be-md.ncbi.nlm.nih.gov&ALIGNDB_CGI_PATH=/ALIGNDB/alndb_asn.cgi&ALIGNDB_MAX_ROWS=100
function constructTaxURLParams() {

    //var params = "CMD=Get&RID=" + $("Rid").value + "&ADV_VIEW=on&DYNAMIC_FORMAT=on&FORMAT_OBJECT=TaxBlast&DESCRIPTIONS=" + getHiddenFieldParamString("DESCRIPTIONS");
    var params = constructGenURLParams();    
    params += "&FORMAT_OBJECT=TaxBlast&DESCRIPTIONS=" + getHiddenFieldParamString("DESCRIPTIONS");
    
    return params;
}

function constructCommonURLParams() {
    
    var genParams = "CMD=Get&RID=" + $("Rid").value + "&ADV_VIEW=on&DYNAMIC_FORMAT=on";
    
    if ($("useAlignDB") && $("useAlignDB").value == "true") {

        var alignDbParams = "&USE_ALIGNDB=true";
        var batchID = document.getElementsByName("ALIGNDB_BATCH_ID");
        if (batchID) {
            alignDbParams += getHiddenFieldParamString("ALIGNDB_BATCH_ID");
            alignDbParams += getHiddenFieldParamString("ALIGNDB_MASTER_ALIAS");
            alignDbParams += getHiddenFieldParamString("ALIGNDB_CGI_HOST");
            alignDbParams += getHiddenFieldParamString("ALIGNDB_CGI_PATH");
        }        
        genParams += alignDbParams;
    }    
    genParams += constructCommonFormatParams(params);    
    var allSeqsSelected = areAllSeqsChecked();
    if(!allSeqsSelected) {
        var seqList = getCheckedSeqList();                     
        if(seqList && seqList != "") {
            genParams += "&ALIGN_SEQ_LIST=" + seqList;
        }
    }    
    return genParams;
}
function constructGenURLParams() 
{
    var params = constructCommonURLParams();
////!!!! Check this
    if (params.indexOf("FORMAT_ENTREZ_QUERY") != -1 && params.indexOf("USE_ALIGNDB") != -1) {
        params = params.replace("&USE_ALIGNDB=true", "");
    }
    return params;
}

function constructCommonFormatParams() {
    var formatParams = "";

    if ($("queryList")) {
        formatParams += "&QUERY_INDEX=" + $("queryList")[$("queryList").selectedIndex].value;
    }    
      
    var allSeqsSelected = areAllSeqsChecked();
    //Do not apply filters if only some sequences are selected
    //And ALIGN_SEQ_LITS param is going to be passed for dynamic display of graph or tax
    if(allSeqsSelected) {
        formatParams += getUrlCompForEntryField($("results").EXPECT_LOW);
        formatParams += getUrlCompForEntryField($("results").EXPECT_HIGH);
        formatParams += getUrlCompForEntryField($("results").PERC_IDENT_LOW);
        formatParams += getUrlCompForEntryField($("results").PERC_IDENT_HIGH);
        formatParams += getUrlCompForEntryField($("results").I_THRESH);        
        var formatOrg = "";
        if ($("entrezLimit") && $("entrezLimit").value != "") {
            formatParams = "&FORMAT_ENTREZ_QUERY=" + encodeURIComponent($("entrezLimit").value);
        }
        if (formatOrg != "" && formatOrg.indexOf("txid") != -1) {
            formatParams += formatOrg;
        }    
    }
    var serviceType = "";
    if ($("serviceType").value == "sra" || $("serviceType").value == "wgs") {
        serviceType = "sra";
    }
    else if ($("clientType").value.toUpperCase() == "TMSmart_restricted".toUpperCase()) {
        serviceType = "restricted";
    }
    if (serviceType != "") {
        formatParams += "&BOBJSRVC=" + serviceType;
    }
    if ($("currQuery").value != "") {
        formatParams += "&CURR_QUERY_ID=" + $("currQuery").value;
    }    
    return formatParams;
}

function constructGraphURLParams() {

    //var params = "CMD=Get&RID=" + $("Rid").value + "&ADV_VIEW=on&DYNAMIC_FORMAT=on&GRAPH_ONLY=true" + getHiddenFieldParamString("NUM_OVERVIEW");    
    var params = constructCommonURLParams();
    params += "&GRAPH_ONLY=true" + getHiddenFieldParamString("NUM_OVERVIEW");    
    if (params.indexOf("ALIGN_SEQ_LIST") == -1) {
        var seqList = getCheckedSeqList();                     
        if(seqList && seqList != "") {
            params += "&ALIGN_SEQ_LIST=" + seqList;
        }
    }
    if (params.indexOf("ALIGN_SEQ_LIST") != -1 && params.indexOf("USE_ALIGNDB") != -1) {
        params = params.replace("&USE_ALIGNDB=true", "");
    }         
    return params;
}

function SubmitMSAViewerRequest(event, lnk) {
    blastUrl = "t2g.cgi";

    
    var rp = new RemoteDataProvider(blastUrl);

    rp.onSuccess = function (obj) {        
        var rid = getHiddenFieldVal("RID");
        winRef = window.open(jQuery("#msaView")[0].href + "?key=" + (obj.responseText) + "&coloring=cons", "lnk" + rid);                   
    };
    rp.onError = function (obj) {
        console.log("Error submitting MSA viewer request");                                           
    }   

    var params = constructGenURLParams();           
    params = params.replace("&DYNAMIC_FORMAT=on","");

    var numQueries = getHiddenFieldVal("NUM_QUERIES");
    numQueries = (numQueries != "" && numQueries != undefined) ? parseInt(numQueries) : 1;
        
    if(jQuery(lnk).attr("seqlist") != "true" && numQueries < 2) {
        //Link at the top of the page for the whole seqalign
        return true;
    }

    //Check if need to pass ALIGN_SEQ_LIST ass parameter
    var getSeqList = jQuery(lnk).attr("seqlist");

    var seqListParam = "";
    var seqList = getCheckedSeqList();                     
    if(seqList && seqList != "") {
        seqListParam = "&ALIGN_SEQ_LIST=" + seqList;
    }
    
    if(params.indexOf("ALIGN_SEQ_LIST") == -1) { //no ALIGN_SEQ_LIST param
        if(getSeqList == "true") { 
            params += seqListParam;
        }
    }
    else {
        if(getSeqList == undefined) { 
            params = params.replace(seqListParam,"");
        }
    }
        
    if(numQueries > 1) {
        params += "&NUM_QUERIES=" + numQueries;
    }
    //params += "&DESCRIPTIONS=0&NUM_OVERVIEW=0&SHOW_OVERVIEW=no&FORMAT_OBJECT=Alignment&FORMAT_TYPE=ASN.1&NETCACHE=on"    
    params += "&FORMAT_OBJECT=Alignment&FORMAT_TYPE=ASN.1&NETCACHE=on"    
    
    
    rp.Request(params);    
    if(event) utils.preventDefault(event);
}

function ReadPairwiseAlignRequest()
{
    var rid = getHiddenFieldVal("RID");
    if (location.href.indexOf("#") != -1) createAlignAnchor();
    ReadNextSeqAligns(0, 5);
    if ($("alignView")) {
        g_alignViewPos = $("alignView").getBoundingClientRect().top; 
    }
    utils.addEvent(window, "scroll", checkAutoAlignLoad, false);    
}
function ReadAlignRequest(e)
{
    alnView = jQuery("#alignViewSelect").val();
    if (alnView == "Pairwise" || alnView == "PairwiseWithIdentities") {              
        jQuery("#dscTable,#dscTable_psiw").find("a[stat].deflnDesc").each(function(index) {
            jQuery(this).removeAttr("stat");        
        });
        jQuery("#alignments").find("div.alnMsg").each(function(index) {
            jQuery(this).remove();        
        });
        jQuery("#queryAnchView").html("");
        ReadPairwiseAlignRequest();        
        jQuery("#ulAlign .prwise").show();
        jQuery("#ulAlign .queryanch").hide();        
    }       
    else {            
        ReadQueryAnchAlignRequest(e);
        jQuery("#ulAlign .prwise").hide();
        jQuery("#ulAlign .queryanch").show();        
    } 
}

function toggelCDDOverview()
{
    if (jQuery("#cddInfo")[0]) {
        if(this.checked) {
            jQuery("#cddInfo").show();
        }
        else {
            jQuery("#cddInfo").hide();
        }
    }
}
function checkConfigColumns(btn,e) 
{
    var colConfig = btn.id == "btndsConfig";
    if(colConfig) {
        var expanded = jQuery(btn).attr('aria-expanded') == 'true';
        var isbtndsConfigClicked = jQuery(e.target)[0] == btn || jQuery(e.target).parent()[0] == btn;
        //if((isbtndsConfigClicked && !expanded) || (!isbtndsConfigClicked && expanded)) {            
        if((expanded)) {            
            var id = jQuery(btn).attr('aria-controls');
            configDescrColumns(e, jQuery(btn), id);
        }
    }
}

function closeAccordion(btn, e) 
{
    //checkConfigColumns(btn, e);
    var parTarget = jQuery(jQuery(e.target)).closest("li")[0];
    var parBtn = jQuery(jQuery(btn)).closest("li")[0];
    if(parTarget && parBtn && jQuery(parTarget)[0] == jQuery(parBtn)[0]) {        
        //console.log("1. The same dialog clicked " + btn.id);        
        return true;
    }    
    var id = jQuery(btn).attr('aria-controls');
    var el = jQuery("#" + id)[0];
    if (!el) 
    {
        console.warn("invalid aria-controls id:" + id);
        return false;
    }
    var expanded = jQuery(btn).attr('aria-expanded') == 'true';
    //console.log(id + ":" + expanded);
    if(expanded) {        
        jQuery(el).attr('aria-hidden', true);
        jQuery(btn).attr('aria-expanded', false);        
        utils.preventDefault(e);
    }    
}


function closeAccordeons(e)
{
    jQuery("#hsum,#navHdr").find("a.usa-accordion-button,button.usa-accordion-button").each(function (index) {        
        closeAccordion(this,e);        
    });
    jQuery("#toolbar").find("button.usa-accordion-button").each(function (index) {        
        checkConfigColumns(this, e);
        closeAccordion(this,e);
    });
}

/* Ping related functions */
function initSingleElemPing()
{
    //for checkboxes:
    if (this.type == "checkbox") {
        ncbi.sg.ping(this, "click", this.checked ? "checked=true" : "checked=false");
    }
    else if (this.type == "select-one") {
        //for selection boxes
        ncbi.sg.ping(this, "change", "selected=" + jQuery(this).val());
    }    
}

function initPingElems()
{
    jQuery("#hsum,#navHdr,#msg").find(".usa-accordion-button").each(function (index) {    
        if(!jQuery(this).attr("id") || jQuery(this).attr("id") != "btnDbDetails") {
            jQuery(this).bind("click", function(e) {
                if(jQuery(this).attr('aria-expanded') == 'false') {            
                    ncbi.sg.ping(this, "click");
                }                      
            });
        }        
    });      
    jQuery("main").find("#FRM_DESCRIPTIONS,#alignViewSelect").each(function (index) {    
        jQuery(this).bind("change", initSingleElemPing);                
    });    
    jQuery("main").find("#showCDSFeature").each(function (index) {    
        jQuery(this).bind("click", initSingleElemPing);                
    });    
    jQuery("#dsConfig").find("input[type='checkbox']").each(function(index) {                    
        jQuery(this).bind("click", initSingleElemPing);                
    });    
    
    var filterPingParams;
    jQuery("#btnFilter").bind("click", function(e) {            
        jQuery("#filterResults").find("input").each(function (index) {            
            if (this.type != "hidden") {                            
                var paramVal;   
                if (this.type == "checkbox") {
                    if(this.checked) paramVal ="true";                    
                }
                else if(jQuery(this).val() != "") {
                    paramVal = jQuery(this).val();                    
                }           
                if(paramVal) {
                    filterPingParams = (filterPingParams) ? filterPingParams + "&" : "";
                    filterPingParams += this.id + "=" + paramVal;
                }
            }
        });    
        if(filterPingParams) {    
            jQuery("#btnFilter").attr("ref",encodeURI(filterPingParams));            
        }
    });   
    
}

function initPSIAlignInfo(seqID) {
    var useInPssm = jQuery("#dtr_" + seqID).attr("usedpssm");
    var newSeq = jQuery("#dtr_" + seqID).attr("new");
    if(newSeq == "on") {        
        jQuery("#csLinks_" + seqID).after(jQuery("#psiInfNew").html());
    }
    if(useInPssm == "on") {                
        jQuery("#csLinks_" + seqID).after(jQuery("#psiInfPssm").html());        
    } 
}

function getSeqidListForSortedDescrTable(sortItems,sortType)
{
    sortItems.sort(function(a, b) {
        var compA = jQuery(a).text();
        var compB = jQuery(b).text();        
        if(jQuery.isNumeric(compA) && jQuery.isNumeric(compB)) {
            compA = parseInt(compA);
            compB = parseInt(compB);        
        }
        else {
            compA = compA.toUpperCase();
            compB = compB.toUpperCase();            
        }        
        ret = (sortType == "desc") ? ((compA > compB) ? -1 : (compA < compB) ? 1 : 0) : (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        return ret;
    });
    seqList = "";    
    sortItems.each(function(index) {                
        trObj = jQuery(this).closest('tr');    
        ind = jQuery(trObj[0]).attr("ind");
        currSeqID = jQuery(jQuery("#deflnDesc_" + ind)[0]).attr("seqFSTA");        
        if(seqList != "") seqList += ","
        seqList +=currSeqID;        
    });
    return seqList;
}

//Not used
//This functions filters descriptions table only to
//common ancestors specified in selectedItems
//Server submit by specifying seqID list to show
function getSeqidListForFilteredItemWithSeqidList(selectedItems) 
//selectedItems - string of selected options in multiple dropdown
{
    //var selItemsArr = selectedItems.split(",");
    selItemsArr = selectedItems;
    var cmnAncestors = jQuery("#dscTable").find("a.cmnName");
    seqList = "";    
    cmnAncestors.each(function(index) {                
        if(jQuery.inArray(jQuery(this).text(), selItemsArr) != -1) {
            trObj = jQuery(this).closest('tr');    
            ind = jQuery(trObj[0]).attr("ind");
            jQuery("#chk_" + ind).checked = true;
            currSeqID = jQuery(jQuery("#deflnDesc_" + ind)[0]).attr("seqFSTA");        
            if(seqList != "") seqList += ","
            seqList +=currSeqID;        
        }        
    });    
    jQuery("#sortedDescrSeqs").val(seqList);    
    modifySubmitResultsParams(jQuery("#sortedDescrSeqs"));   
    $("results").submit();
    //utils.preventDefault(e);                  
}

//Not used
//This functions filters descriptions table only to
//common ancestors specified in selectedItems
//Client processing (hiding showing rows)
function getSeqidListForFilteredItem(selectedItems) 
//selectedItems - string of selected options in multiple dropdown
{
    selItemsArr = selectedItems;
    var cmnAncestors = jQuery("#dscTable").find("a.cmnName");
    seqList = "";        
    cmnAncestors.each(function(index) {                
        trObj = jQuery(this).closest('tr');    
        ind = jQuery(trObj[0]).attr("ind");
        if(jQuery.inArray(jQuery(this).text(), selItemsArr) != -1) {            
            jQuery("#chk_" + ind).checked = true;
            jQuery(trObj).show();            
        }   
        else {
            jQuery("#chk_" + ind).checked = false;            
            jQuery(trObj).hide();
        }     
    });        
}

//Not used 
//This function fills selection box "cmnFilterSel" with unique Cluster ancestors
function fillClustComAncestorSelectBox()
{
    var sortType ="asc";
    var sortItems = jQuery("#dscTable").find("a.cmnName");
    sortItems.sort(function(a, b) {
        var compA = jQuery(a).text();
        var compB = jQuery(b).text();        
        if(jQuery.isNumeric(compA) && jQuery.isNumeric(compB)) {
            compA = parseInt(compA);
            compB = parseInt(compB);        
        }
        else {
            compA = compA.toUpperCase();
            compB = compB.toUpperCase();            
        }        
        ret = (sortType == "desc") ? ((compA > compB) ? -1 : (compA < compB) ? 1 : 0) : (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        return ret;
    });
    //Fill selection box with uniqArr    
    var cmnAncArr = [];    
    sortItems.each(function(index) {                
        cmnAncArr.push(jQuery(this).text());
    });
    cmnAncArr = jQuery.unique(cmnAncArr);    
    jQuery.each(cmnAncArr, function(index) {                
        jQuery("#cmnFilterSel").append(new Option(this, this));
    });            
}

function GetResults()
{
    $("results").QUERY_INDEX.value = $("queryList")[$("queryList").selectedIndex].value;        
    modifySubmitFormatParams(jQuery("#showCDSFeature")[0]);
    modifySubmitFormatParams(jQuery("#alignViewSelect")[0]);
    modifySubmitFormatParams(jQuery("#lineLength")[0]);    
    if ($("results").SESSION_ID) jQuery($("results").SESSION_ID).remove();            
    $("results").submit();   
}

function resetFormatOptions()
{
    jQuery("#alignViewSelect").val("Pairwise");
    jQuery("#lineLength").val("60");
    jQuery("#showCDSFeature").attr('checked', false);    
    ReadAlignRequest();
}


function InitPageControls()
{
    jQuery("#hsum").find("div.calcW").each(function (index) {
        if(jQuery(this).width() < getHTMLTextWidth(jQuery(this))){
            jQuery("#" + this.id + "ML").css("display","inline"); 
        }            
    });
      
    
    jQuery("#hsum").find("div.usa-accordion-content,ul.usa-accordion-content,ul.usa-nav-submenu").each(function (index) {
        jQuery(this).removeClass("hidden");        
    });
    jQuery("#toolbar").find("ul.usa-nav-submenu").each(function (index) {
        jQuery(this).removeClass("hidden");        
    });
    if(jQuery("#fullEntrezForm")) jQuery("#fullEntrezForm").removeClass("hidden");
    if(jQuery("#fullEntrez")) jQuery("#fullEntrez").removeClass("hidden");
    jQuery("#tabGraphic").removeClass("hidden");
    jQuery("#tabAlign").removeClass("hidden");
    jQuery("#tabTaxon").removeClass("hidden");    
    jQuery("#tabDotMatrix").removeClass("hidden");    
    

    jQuery("#searchStat").removeClass("hidden");        
    jQuery("#searchStat").html(jQuery("#searchStatInfo").html());
    jQuery("#searchStatInfo").html("");    
    jQuery("#searchStatInfo").remove();    
    if (jQuery("#cddInfo")[0]) {        
        jQuery("#showCDD").click();        
        jQuery("#showCDD").bind("click",toggelCDDOverview);
    }
    else {
        jQuery("#liShowCDD").hide();
    }
    jQuery("#qorganism").ncbiautocomplete();     
    jQuery("body").bind("click", closeAccordeons);   
    jQuery("#dscTable,#dscTable_psiw").find("th a").each(function (index) {
        jQuery(this).bind("click",function(e) {                        
            seqList = "";            
            if(!areAllSeqsChecked()) {
                seqList = getCheckedSeqList();                                                    
            }
            jQuery("#checkedSeqs").val(seqList);
            var dspSort = jQuery(this).attr("dispsort");
            var sortType = jQuery(this).attr("sortType");
            sortType = !sortType ? "asc" : sortType;
            initSortDescrTable(dspSort,sortType);                        
            modifySubmitResultsParams(jQuery("#checkedSeqs"));
            $("results").action += "#sort_mark";
            $("results").submit();
            utils.preventDefault(e);            
        });
    });
    
    initPingElems();
    jQuery("#topBtn").bind("click", topFunction);       
    jQuery("#allDownload").find("a").each(function (index) {
        jQuery(this).bind("click",function(){location.href = this.href;});        
    });
    jQuery("#formBlastDescr,#hsum").find("button.btnPsiIter").each(function (index) {
        jQuery(this).bind("click",function(){mergeFormsToSubmit("submitFromRes","formBlastDescr");});        
    });               
    if(jQuery("#hdLink")[0] && jQuery("#psiFirstNew")[0]) {
        jQuery("#hdLink").bind("click",function(){
            var firstTrNewID = "#dtr_" + jQuery("#psiFirstNew").val();
            //PSI BLAST skip to first new seq
            if(jQuery("#tabDescr").attr("aria-hidden") == "false") {
                this.href = firstTrNewID;
            }
            else {
                var deflnDesc = jQuery(firstTrNewID).find("a.deflnDesc");
                if(deflnDesc.length > 0) {
                    if(jQuery(deflnDesc).attr("stat")=="disp") {                                
                        this.href = "#alnHdr_" + jQuery("#psiFirstNew").val();
                    }
                    else {                        
                        jQuery(deflnDesc)[0].click();                        
                    }                                    
                }                
            }
        });
    }     
    if(!jQuery("#dotMatrixInfo")[0]) {
        jQuery("#btnDotMatrix").hide();    
    }
    else {    
        jQuery("#btnDotMatrix").bind("click",function(){
            $("hitmtImg").src= $("hitmtImg").getAttribute("imgsrc");
        });
        jQuery("#hitmtImg").bind("load", function() {                   
            jQuery("#hmImage").show();            
        });           	
    }    
    if ($("serviceType").value != "sra" && $("serviceType").value != "wgs") {            
        var dbs;
        var dbDisplayName = getHiddenFieldVal("DB_DISPLAY_NAME");
        if(dbDisplayName == "Microbial_proteins") {
            dbs=dbDisplayName
        }
        else {
            dbs = getHiddenFieldVal("DATABASE");
        }
        //Add ping info for "See details"
        jQuery("#btnDbDetails").bind("click", function(e) {            
            var opened = jQuery(this).attr("aria-expanded") == "false" ? "true": "false";
            jQuery(this).attr("ref","link_text=" + dbs + "&opened=" + opened);                                     
        });
        loadDbInfo(dbs);
    }    
    jQuery("a.msaView").bind("click", function(e) {            
        SubmitMSAViewerRequest(e,this);        
    });
    //Collapsible transcript + genomic tables        
    jQuery("#dscTable").find("button.tgl").each(function(index) {                
        jQuery(this).bind("click", function (e) {
            var seqType = jQuery(this).attr("aria-controls");
            if(jQuery(this).attr("aria-expanded") == "false") {
                jQuery("#dscTable tr." + seqType).show();
                jQuery(this).attr("aria-expanded","true");
            }
            else {
                jQuery("#dscTable tr." + seqType).hide();
                jQuery(this).attr("aria-expanded","false");
            }                
            utils.preventDefault(e);
        });        
    });                    
}

function initSortDescrTable(dspSort,sortType)
{
  if(!jQuery.isNumeric(dspSort)) {
    var mixedDbs = getHiddenFieldVal("MIXED_DATABASE");
    var seqList = ""
    if(mixedDbs==undefined) {
        var sortItems = jQuery("#dscTable").find("a." + dspSort + ",td." + dspSort);
        seqList = getSeqidListForSortedDescrTable(sortItems,sortType);
        sortItems = jQuery("#dscTable_psiw").find("a." + dspSort + ",td." + dspSort);
        if(sortItems != undefined) {
            if(seqList != "") seqList += ",";
            seqList += getSeqidListForSortedDescrTable(sortItems,sortType);
        }
    }
    else {
        var sortItems = jQuery("#dscTable").find("a[seqtype='" + "Transcr" +"']." + dspSort + ",td[seqtype='" + "Transcr" +"']." + dspSort);
        seqList = getSeqidListForSortedDescrTable(sortItems,sortType);
        var sortItems = jQuery("#dscTable").find("a[seqtype='" + "GnmSeq" +"']." + dspSort + ",td[seqtype='" + "GnmSeq" +"']." + dspSort);
        if(seqList != "") seqList += ",";
        seqList += getSeqidListForSortedDescrTable(sortItems,sortType);
    }                                
    jQuery("#sortedDescrSeqs").val(seqList);    
    modifySubmitResultsParams(jQuery("#sortedDescrSeqs"));                    
 }
 else {            
    jQuery("#displaySort").val(dspSort);
    var hspSort = jQuery(this).attr("hspsort");
    jQuery("#hspSort").val(hspSort);
    modifySubmitResultsParams(jQuery("#displaySort"));
    modifySubmitResultsParams(jQuery("#hspSort"));                                
    jQuery($("results")).find("input[name='SORTED_DESCR_SEQS']").each(function (index) {        
        jQuery(this).remove();
    });
 }
 jQuery("#sortBy").val(dspSort);    
 modifySubmitResultsParams(jQuery("#sortBy"));                    
 modifySubmitResultsParams(jQuery("#cfcDsSave"));                     
}



function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("topBtn").style.display = "block";
    } else {
        document.getElementById("topBtn").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

var g_LastCheckedSeqIndex = 0;
//This function is specified in templates for onclick labels in descriptions table
///1. Record index of the last clicked checkox without shiftkey pressed (checkShiftKey)
///2. If shift key is pressed:
    //a. detremine check or uncheck of last clicked checkox
    //b. check/uncheck all checkboxes between current and last clicked checkox
function checkShiftKey(e,elem)
{
    var trObj = jQuery(elem).closest('tr');    
    var ind = parseInt(jQuery(trObj[0]).attr("ind"));
    if (e.shiftKey && g_LastCheckedSeqIndex != 0) {
        //exec #2.a 
        var isChecked =  jQuery("#chk_" + g_LastCheckedSeqIndex)[0].checked;
        var startIndex = (ind > g_LastCheckedSeqIndex) ? g_LastCheckedSeqIndex + 1 : ind;
        var stopIndex = (ind > g_LastCheckedSeqIndex) ? ind : g_LastCheckedSeqIndex - 1;
        //exec #2.b
        for(i=startIndex; i <= stopIndex; i++) {
            if(jQuery("#chk_" + i)[0].checked != isChecked) jQuery("#chk_" + i)[0].click();
        }                
    }    
    else { //record index (#1)        
        g_LastCheckedSeqIndex = ind;
    }
}

//not used
function traceShiftKey()
{
    jQuery(document).on("keyup keydown", function(e) {
        if(e.keyCode == 16) {
            switch(e.type) {
                case "keydown" :
                    console.log("shift key pressed");                
                    break;
                case "keyup" :
                    console.log("shift key released");                                
                    //clear last clicked checkox
                    //g_LastCheckedSeqIndex = 0;
                    break;
            }
        }
        return true;
    });
}

var g_MultipleDBS = 0;
var g_NumDbRetrieved = 0;
function loadDbInfo(dbs) 
{

    
    dbBuildName = getHiddenFieldVal("BUILD_NAME");
    dbTaxid = getHiddenFieldVal("DBTAXID"); 
    var program = getHiddenFieldVal("PROGRAM");
    
    if(dbs==undefined || program == undefined || jQuery("#dbHelpInfo")[0]==undefined) return;
    
    var isprot = (program == "blastp" || program == "blastx") ? "on" : "off";
    var params = "IS_PROT=" + isprot;
  
    if (dbBuildName) {
        params += "&BUILD_NAME=" + dbBuildName;
    }
    if (dbTaxid) {
        params += "&TAXID=" + dbTaxid;
    }        
    params += "&IS_COMPLETE=on" ;
        
    var dbsList = dbs.split(" ");
    g_MultipleDBS = dbsList.length;
    if (g_MultipleDBS > 1) $("dbHelpInfo").innerHTML = "";
        
    for (var i = 0; i < dbsList.length; i++) {
        showDbDetailsOne(dbsList[i], params);
    }
}
var g_DescrColumnsSelection = "";

function initDescConfig() 
{
    initConfigColumns("dsConfig");                 
    g_DescrColumnsSelection = "";
    jQuery("#dsConfig").find("input[type='checkbox']").each(function(index) {
        if(jQuery("#cfcDsInf").val().indexOf(jQuery(this).val()) == -1) {
            showHideDescrTableCol("dscTable_psiw", this, true);
        }        
        if(this.checked && !jQuery(this).parent().hasClass("hidden")) {
            if (g_DescrColumnsSelection != "") g_DescrColumnsSelection += ",";
            g_DescrColumnsSelection += this.id;                            
        }        
    });    
    jQuery("#colRestoreDef").bind("click", function(e) {
        jQuery("#dsConfig").find("input[type='checkbox']").each(function(index) {
            var defaultConfig = jQuery("#cfcDsInf").attr("defval");
            if ( (defaultConfig.indexOf(jQuery(this).val()) != -1 && !this.checked) || 
                 (defaultConfig.indexOf(jQuery(this).val()) == -1 && this.checked) ){
                jQuery(this).click();
            }
        });
        var btn = jQuery("#btndsConfig");
        var id = jQuery(btn).attr('aria-controls');
        configDescrColumns(e, this, id);
        closeAccordion(jQuery("#btndsConfig"), e);            
    });                
}

var g_ReIndexDescriptions = false;
function initAdvancedView(e)
{
    InitPageControls();
    InitFilerOrg()
    if (!jQuery("#noRes")[0]){       
        initDescSelect();                        
        ReadAlignRequest(e);
        if ($("dynGraphLoad") && $("dynGraphLoad").value == "on") ReadGraphAlinRequest();                        
        initDescConfig();        
        initSelectAll("select-all");
        if ($("psiw") && utils.hasClass($("psiw"), "shown")) {        
            initSelectAll("select-all_psiw");
        }        
        jQuery("#ulDescr").children("li").children("button.usa-accordion-button").each(function(index) {            
            jQuery(this).bind("click", function(e) {            
                var ret = true;
                if(jQuery(this).attr("aria-expanded") == "true") {
                    ret = false;
                }
                if(getAllSelectedSeqsNumber() == 0) {
                    alert("Please, select sequences");
                    return false;
                }
                if(jQuery(this).attr("dynLoad")) {
                    if(g_ReIndexDescriptions) {
                        reIndexDescriptions();         
                        resetGlobals();
                    }               
                    reloadFunction = jQuery(this).attr("reload");
                    if(reloadFunction) {
                        //Call ExecTaxonomyRequest(e) or  ExecGraphAlinRequest(e) ExecAlinRequest(e)                  
                        eval(reloadFunction + "(e)");
                        jQuery(this).removeAttr("reload");
                    }                    
                }
                return ret;
            });                         
        });                         
        jQuery("#dsConfig").find("input[type='checkbox']").each(function(index) {                                    
            jQuery(this).bind("click", function(e) {            
                resetDescrTableWidth();               
                adjustColwidth();                
            });                            
        });    
        
        initDescDownLoad();
        InitFormatPage();          
        ExecGraphAlinRequest();
        ExecTaxonomyRequest();                                        
    }
    else {
        jQuery("#mainCont").hide();
        if ($("helpDsk") && $("userAgent") && $("userAgent").value != "") {
            $("helpDsk").href += encodeURIComponent($("userAgent").value);
        }
    }    
    jQuery("#ld").hide();
    utils.addEvent(window,"scroll",scrollFunction,false);

    var resizeTimer;    
    jQuery(window).resize(function (e) {                    
        adjustColwidth();            
        if(jQuery("#queryAnchView").is(":visible") && e.srcElement!=undefined){
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                initQueryAnchoredScrolling(); // Run code here, resizing has "stopped"
            }, 250);            
        }    
    });     
    initDescrTableScroll();
    initClusterDBParams();
    window.ncbi.pinger.registerMutator('render', function(ping) {
        // You can get access to the data that the intercepted render ping will
        // send by calling `ping.params`. In this case we're just adding data
        // to render pings.
        return {"columnChk": g_DescrColumnsSelection};
    });
    ncbi.pinger.track();
    
}

function initClusterDBParams()
{
    if(jQuery("#clusterDB")[0] && jQuery("#clusterDB").val() == "clustdb") {        
        
        var blastSpec = getHiddenFieldVal("BLAST_SPEC");
        if(blastSpec == "TestDBExp") {
            jQuery("#filOrg").hide();
        }
        else {
            //jQuery("#filterRes").hide();            
        }
        //Init genbank submission for cluster db server formatting
        jQuery("#dscTable").find("table.clust a.clustSeq").each(function(index) {                    
            jQuery(this).bind("click", function (e) { 
                jQuery("#selSeqs").val(jQuery(this).text());    
                jQuery("#submitterTop").submit();
                utils.preventDefault(e);
            });            
        });
        //Close cluster detail dialog if click outside div.content        
        jQuery(document).on("click", function(event){         
            if(!event.target.closest("div.content")) {
                if(!event.target.closest("div[role='dialog']") ){
                    jQuery(document).find("div.popDl.clust.ui-dialog-content").each(function(index) {
                        if(jQuery(this).ncbidialog("isOpen")) {
                            jQuery(this).ncbidialog("close");
                        }
                    });                               
                }
            }
        });
        //Processing links ("Show ALignment", "Tree View") at the top of cluster popup     
        jQuery("#dscTable,#dscTable_psiw").find("td.c6 div.popDl a.toolsCtr").each(function(index) {                
            jQuery(this).bind("click", function (e) {             
                getAndSubmitClusterMembers(this);
            });
        });            
        
        //Populate cluster member and taxa number for client formatting
        getClusterSummaryInfo();    
    }
    else {
        //Initialize Ad for cluster database (appears only for nr)
        //Close button
        jQuery("#resAd button.close").bind("click", function (e) { 
            var ariaContrl = jQuery(this).attr("aria-controls"); 
            jQuery("#" + ariaContrl).remove();
        });
        //Initialize BLAST button to submit cluster database search(appears only for nr)
        //BLAST button
        jQuery("#clustSearch").bind("click", function (e) {         
            setSubmitResultsParams("DATABASE","nr_cluster_seq");
            jQuery("#searchOptions").click()
        });
    }
}


function getNextClusterMembers(event, btn)
{
    getClusterDetailInfo(event,btn);
    utils.preventDefault(event);    
}

function initClustDlg(link)
{
    var trObj = jQuery(link).closest('tr');    
    var descrRowIndex = jQuery(trObj).attr("ind");
    var clustMemPopup = jQuery("#dlgClust_"  + descrRowIndex);    
    var btnClustDetail = jQuery("#btnClustMem_" + descrRowIndex);
        
    var acc = jQuery("#clustMem_" + descrRowIndex).attr("acc");
    //Init scientific name for cluster    
    var ancName = jQuery(trObj).find('a.cmnName').html();            
    var memNbr = trObj.find("a.clustMem span.memNbr").html();
        
    //jQuery(clustMemPopup).ncbidialog('option', 'position', [x,y]);
    
    jQuery(clustMemPopup).ncbidialog();
    if(!jQuery(clustMemPopup).ncbidialog("isOpen")) {
        jQuery(clustMemPopup).ncbidialog('option', 'draggable', true);              
        jQuery(clustMemPopup).ncbidialog("open");    
        jQuery(clustMemPopup).ncbidialog('option','title', acc +" (" + ancName + ") - " + memNbr + " member(s)");
        if(!jQuery(btnClustDetail).attr("membLoaded")) {            
            jQuery(btnClustDetail).click();
        }
        
        
        
        jQuery(clustMemPopup).parent().position({
            of: jQuery(link),
            my: 'left top',
            at: 'right bottom'          
        });
    }    
}

function getClusterMembers(clustMemID)
{
    if(jQuery("#" + clustMemID).attr("aria-expanded") == "false") {
        jQuery("#" + clustMemID).click();
    }
}


function getClusterDetailInfo(event,btn)
{
    if(jQuery(btn).attr("membLoaded")) {
        return;
    }

    clustMemPopup = jQuery(btn).closest('div.popDl.clust');
    trObj = jQuery(jQuery(clustMemPopup).attr("trid"));        
    
    var descrRowIndex = jQuery(trObj).attr("ind");
    var acc = jQuery("#clustMem_" + descrRowIndex).attr("acc");
    var clustStartIndex = jQuery(btn).attr("clustStartIndex");
    clustStartIndex = (clustStartIndex) ? clustStartIndex : 1;
    var clustDisplayOption = 1;//Members only
    jQuery("#clustLd_" + descrRowIndex).show(); //Show loading icon

    var dbInfoUrl =  "getDBInfo.cgi";
    var rp = new RemoteDataProvider(dbInfoUrl);
    
    rp.onSuccess = function (obj) {        
        
        jQuery(clustMemPopup).find("div.clustMemRep").html("")
        jQuery(clustMemPopup).find("#clustMemRep_" + descrRowIndex).append(obj.responseText);
        jQuery(btn).attr("membLoaded","on");
        jQuery("#clustLd_" + descrRowIndex).hide();        
        if(clustDisplayOption == 0) {
            /***Taxreport code begin****/
            var taxReport = jQuery(clustMemPopup).find(".clusttax");        
            var x = jQuery(taxReport).detach();        
            jQuery("#clustTaxLinageRep_" + descrRowIndex).append(x);        
            jQuery(x).removeClass("hidden");
            /***Taxreport code end****/
        }
        var rid = getHiddenFieldVal("RID");

        //Init scientific name for cluster        
        var sciName = jQuery(trObj).find('td.c3 a.sciName')[0];
        if(sciName) {
            capSciName = jQuery(clustMemPopup).find('caption span.csn');
            if(capSciName) {
                jQuery(capSciName).html(jQuery(sciName).html())                
            }            
        }   
        //Initialize pings
        var ref = "link_action_name=fromClustPopup&clust="+ acc;                             
        jQuery(clustMemPopup).find("div.moreMbr a").each(function(index) {                                            
            link_text = jQuery(this).hasClass("right") ? "next" : "prev";             
            jQuery(this).attr("ref", ref + "&link_text=" + link_text);
        });                   
        jQuery(clustMemPopup).find("table.clust a").each(function(index) {                    
            //Init target for links in popup
            jQuery(this).attr("target","lnk" + rid);        
            var linkRef = ref;
            linkRef += "&link_text=" + jQuery(this).text();
            if(jQuery(this).hasClass("clustSeq")) {
                jQuery(this).attr("href","https://www.ncbi.nlm.nih.gov/protein/" + jQuery(this).text());
            }            
            jQuery(this).attr("ref", linkRef);            
            //Init genbank submission
            if(jQuery(this).hasClass("clustSeq")) {            
                jQuery(this).bind("click", function (e) { 
                    jQuery("#selSeqs").val(jQuery(this).text());    
                    jQuery("#submitterTop").submit();
                    utils.preventDefault(e);
                });            
            }
        });                            
        
    };
    rp.onError = function(obj) {
        console.log("getClusterDetailInfo: getDBInfo.cgi error, params: " + params);        
    }    
    var clustMemPopup = jQuery("#dlgClust_"  + descrRowIndex);    
    var params = "CMD=getClusterDetail&CLUST_DB_ACC=" + acc + "&CLUST_START_INDEX=" + clustStartIndex;                
    if(jQuery("#filterClustTaxidsIncl") && jQuery("#filterClustTaxidsIncl").val() != "") {
        params += "&CLUST_INCLUDE_TAXIDS=" + jQuery("#filterClustTaxidsIncl").val();
    }
    if(jQuery("#filterClustTaxidsExcl") && jQuery("#filterClustTaxidsExcl").val() != "") {
        params += "&CLUST_EXCLUDE_TAXIDS=" + jQuery("#filterClustTaxidsExcl").val();
    }
        
    rp.Request(params,"POST");

}



function getClusterDetailTaxInfo(event,btn) 
{
    if(jQuery(btn).attr("membLoaded")) {
        return;
    }
    clustMemPopup = jQuery(btn).closest('div.popDl.clust');    
    var trObj = jQuery(jQuery(clustMemPopup).attr("trid"));            
    var descrRowIndex = jQuery(trObj).attr("ind");
    var acc = jQuery("#clustMem_" + descrRowIndex).attr("acc");
    jQuery("#clustLd_" + descrRowIndex).show();


    var dbInfoUrl =  "getDBInfo.cgi";
    var rp = new RemoteDataProvider(dbInfoUrl);
    
    rp.onSuccess = function (obj) {                
        jQuery(clustMemPopup).find("#clustTaxLinageRep_" + descrRowIndex).append(obj.responseText);
        jQuery(clustMemPopup).find(".clusttax").removeClass("hidden");                
        jQuery("#clustLd_" + descrRowIndex).hide();
        jQuery(btn).attr("membLoaded","on");
    };
    rp.onError = function(obj) {
        console.log("getClusterDetailTaxInfo: getDBInfo.cgi error, params: " + params);        
    }    
    var clustMemPopup = jQuery("#dlgClust_"  + descrRowIndex);    
    var params = "CMD=getClusterDetailTax&CLUST_DB_ACC=" + acc;                
    if(jQuery("#filterClustTaxidsIncl") && jQuery("#filterClustTaxidsIncl").val() != "") {
        params += "&CLUST_INCLUDE_TAXIDS=" + jQuery("#filterClustTaxidsIncl").val();
    }
    if(jQuery("#filterClustTaxidsExcl") && jQuery("#filterClustTaxidsExcl").val() != "") {
        params += "&CLUST_EXCLUDE_TAXIDS=" + jQuery("#filterClustTaxidsExcl").val();
    }
    
    rp.Request(params,"POST");
}

//Called from eval(sbFunction + "(elem, descr)");
function submitDownLoadClustFSTA(radioElem, descr) 
{
    $("sbmtFASTA").DOWNLOAD_TYPE.value = "complete";    
    $("sbmtFASTA").DATABASE.value = "nr nr_cluster_seq";    
    $("sbmtFASTA").submit();    
}

function submitClustDownloadExtTool(btn,clustMemeList)
{
    if(jQuery(btn).attr("sbfunc")) {                
        jQuery("#sbmtFASTA [name='ALIGN_SEQ_LIST'").val(clustMemeList)    
    }
    else {
        jQuery("#selDnSeqs").val(clustMemeList);
    }        
    submitSelectedSeqsForDownload(btn,true);
}


function initDownLoadClustMulti(elem) 
{
    var clustReprList = collectSelectedAccs("dscTable", elem);
    
    
    var dbInfoUrl =  "getDBInfo.cgi";
    var rp = new RemoteDataProvider(dbInfoUrl);
    jQuery("#ld").show();    
    rp.onSuccess = function (obj) {                                
        submitClustDownloadExtTool(elem,obj.responseText);                
        jQuery("#ld").hide();

    };
    rp.onError = function(obj) {
        console.log("initDownLoadClustMulti: getDBInfo.cgi error, params: " + params);        
    }    
    
    var params = "CMD=getClusterDetailAccList&CLUST_DB_ACC=" + clustReprList;    
    
    rp.Request(params,"POST");
}


function initDownloadClust(btn) 
{
    clustMemPopup = jQuery(btn).closest('div.popDl.clust');    
    var trObj = jQuery(jQuery(clustMemPopup).attr("trid"));            
    var descrRowIndex = jQuery(trObj).attr("ind");
    var acc = jQuery("#clustMem_" + descrRowIndex).attr("acc");
    var clustMemPopup = jQuery("#dlgClust_"  + descrRowIndex);        

    
    var clustMemeList = jQuery(clustMemPopup).find("[name='clustMemList'").val();
    if (clustMemeList != "") {
        submitClustDownloadExtTool(btn,clustMemeList);        
        return;
    }
    jQuery("#clustLd_" + descrRowIndex).show();    
    var dbInfoUrl =  "getDBInfo.cgi";
    var rp = new RemoteDataProvider(dbInfoUrl);
    
    rp.onSuccess = function (obj) {                        
        jQuery(clustMemPopup).find("[name='clustMemList'").val(obj.responseText);        
        submitClustDownloadExtTool(btn,obj.responseText);                
        jQuery("#clustLd_" + descrRowIndex).hide();        

    };
    rp.onError = function(obj) {
        console.log("initDownloadClust: getDBInfo.cgi error, params: " + params);        
    }    
    var clustMemPopup = jQuery("#dlgClust_"  + descrRowIndex);        
    var params = "CMD=getClusterDetailAccList&CLUST_DB_ACC=" + acc;    
    
    rp.Request(params,"POST");
}

//This function calls viewClustMembers or cobalt submit
function submitClusterMembers(elem,acc,clustMemList)
{
    var func = jQuery(elem).attr("func");        
    if (func) {
        eval(func + "(elem, acc,clustMemList)");
    }        
}

function getAndSubmitClusterMembers(elem) 
{
    clustMemPopup = jQuery(elem).closest('div.popDl.clust');    
    var trObj = jQuery(jQuery(clustMemPopup).attr("trid"));            
    var descrRowIndex = jQuery(trObj).attr("ind");
    var acc = jQuery("#clustMem_" + descrRowIndex).attr("acc");
    var clustMemPopup = jQuery("#dlgClust_"  + descrRowIndex);        

    
    var clustMemeList = jQuery(clustMemPopup).find("[name='clustMemList'").val();
    if (clustMemeList != "") {
        submitClusterMembers(elem,acc,clustMemeList);        
        return;
    }
    jQuery("#clustLd_" + descrRowIndex).show();    
    var dbInfoUrl =  "getDBInfo.cgi";
    var rp = new RemoteDataProvider(dbInfoUrl);
    
    rp.onSuccess = function (obj) {                        
        jQuery(clustMemPopup).find("[name='clustMemList'").val(obj.responseText);        
        submitClusterMembers(elem,acc,obj.responseText);        
        jQuery("#clustLd_" + descrRowIndex).hide();        

    };
    rp.onError = function(obj) {
        console.log("initDownloadClust: getDBInfo.cgi error, params: " + params);        
    }    
    var clustMemPopup = jQuery("#dlgClust_"  + descrRowIndex);        
    var params = "CMD=getClusterDetailAccList&CLUST_DB_ACC=" + acc;    
    
    rp.Request(params,"POST");
}


function checkBroadcastChannel(elem, rid,bc,ridType)
{
    //console.log("RID:" + rid);
    var ulObj = jQuery(elem).closest('ul');                
    jQuery(ulObj).find("[name='" + ridType + "'").val(rid);  
    console.log("Closing channel " + bc);   
    bc.close();           
}

//Bl2seq or cobalt search was submitted already and there is RID 
//that is recorded in ul attribute for cluster members popup toolsCtr links
function viewClustMembersURL(elem,acc)
{
    var ulObj = jQuery(elem).closest('ul');                        
    var ridType = jQuery(elem).attr("ridType");//"blast2SeqRID" or "cobaltRID"
    var submitToURL = false;

    //Check if blast2seq or cobalt search was already submitted
    //rid will be  blast2SeqRID or cobaltRID
    var rid = jQuery(ulObj).find("[name='" + ridType + "'").val();   
    if(rid != "") {                
        submitToURL = true;        
    }

    if(submitToURL) {
        var sbmURLForm = jQuery(elem).attr("frmURL");        
        jQuery("#" + sbmURLForm).find("[rid='" + ridType + "']").val(rid);                                     
        var clustDBBlastRID = getHiddenFieldVal("RID"); 
        //window name: clustMem_RID_ClustRep
        var winName = "clustMem_" + clustDBBlastRID + "_" + acc;   
        jQuery("#" + sbmURLForm).attr("target",winName);
        jQuery("#" + sbmURLForm).submit();
    }
    return submitToURL;
}

//Called from clustdb.dat
function viewClustMembers(elem,acc,clustMemList)
{
    //Check if blast2seq or cobalt search was already submitted and RID available
    //In this case submit directly to URL
    var submittedToURL = viewClustMembersURL(elem,acc);    
    if(submittedToURL) {
        return;
    }

    var sbmForm = jQuery(elem).attr("frm");  
    var seqList = jQuery(elem).attr("seqList");  
    var numSeq =  jQuery(elem).attr("numSeq");
    
    var clustMemList = clustMemList.split(",");
    var num = clustMemList.length;

    var clustDBBlastRID = getHiddenFieldVal("RID"); 
    
    var broadCastChannel, ridType;
    var ridType = jQuery(elem).attr("ridType");//"blast2SeqRID" or "cobaltRID"    
    if(ridType=="blast2SeqRID") {     //sbmForm =="sbmtBlast2Seq'
        jQuery("#" + sbmForm).find("[name='" + numSeq + "']").val(num);    
        var tool = jQuery(elem).attr("tool");    
        if(tool) {
            jQuery("#" + sbmForm).find("[name='SHOW_IN_EXTERNAL_TOOL']").val(tool);    //TreeView or MSAView
        }
        else {
            jQuery("#" + sbmForm).find("[name='SHOW_IN_EXTERNAL_TOOL']").val("");  //Blast2SeqSearch
        }
        //jQuery("#" + sbmForm).find("[name='JOB_TITLE']").val("BLAST Alignment for " + acc);    
        
        clustMemList = clustMemList.join("\n");
        broadCastChannel = "clustMem_bl2seq_" + clustDBBlastRID + "_" + acc;           
    }
    else if(ridType=="cobaltRID") {   //sbmForm =="sbmtMultiAlnClust"        
        if(num > 250) {            
            num = 250;
            clustMemList = clustMemList.slice(0,250);
            alert("Only first 250 cluster members will be submitted");
        }
        jQuery("#" + sbmForm).find("[name='" + numSeq + "']").val(num);    
        broadCastChannel = "clustMem_cobalt_" + clustDBBlastRID + "_" + acc;                   
    }
    //Insert broadCastChannel Name into submit form           
    if(broadCastChannel) {
        jQuery("#" + sbmForm).find("[name='broadCastChannel']").val(broadCastChannel);            
    }
    jQuery("#" + seqList).val(clustMemList);            
    
    //window name: clustMem_RID_ClustRep    
    var winName = "clustMem_" + clustDBBlastRID + "_" + acc;           
    jQuery("#" + sbmForm).attr("target",winName);
    jQuery("#" + sbmForm).submit();
       
    if(broadCastChannel && ridType) {
        const bc = new BroadcastChannel(broadCastChannel);               
        bc.addEventListener('message', event => {
            console.log("Adding listening event " + broadCastChannel);
            checkBroadcastChannel(elem,event.data,bc,ridType)
        });        
    }    
}

function getClusterSummaryInfo() 
{
    
    var dbInfoUrl =  "getDBInfo.cgi";
    var rp = new RemoteDataProvider(dbInfoUrl);

    rp.onSuccess = function (obj) {
        //obj.responseText = "EOA94035.1:6,5;NWQ89885.1:36,29;P20739.1:1,1"
        var rid = getHiddenFieldVal("RID");    
        var clustInfo = obj.responseText.split(";");
            for (i = 0; i < clustInfo.length; i++) {
            oneClustInfo = clustInfo[i].split(":");  //"EOA94035.1:6,5,"              
            if(oneClustInfo.length > 1) {
                clustNums = oneClustInfo[1].split("$");
                if(clustNums.length > 1) {
                    var clustMem = clustNums[0];                    
                    var clustTaxa = clustNums[1];
                    var taxid = clustNums[2];
                    var sciName = clustNums[3];
                    var cmnName = clustNums[4];
                    target="lnk" + rid;          
                    var title =  "Taxonomy for ";
                    var testVersionA = true;
                    jQuery("#dscTable,#dscTable_psiw").find("tr[acc='" + oneClustInfo[0] + "'] a.clustMem span.memNbr").each(function(index) {                
                        jQuery(this).text(clustMem);
                        testVersionA = false;
                    });        
                    if(testVersionA ) {
                        jQuery("#dscTable,#dscTable_psiw").find("tr[acc='" + oneClustInfo[0] + "'] a.clustMem").each(function(index) {                
                            jQuery(this).text(clustMem);                            
                        });        
                        jQuery("#dscTable,#dscTable_psiw").find("tr[acc='" + oneClustInfo[0] + "'] td.clustTaxa").each(function(index) {                
                            jQuery(this).text(clustTaxa);
                        });
                    }
                    else {
                        jQuery("#dscTable,#dscTable_psiw").find("tr[acc='" + oneClustInfo[0] + "'] a.clustMem span.taxNbr").each(function(index) {                
                            jQuery(this).text(clustTaxa);
                        });    
                    }
                    
                    var taxLink;                    
                    jQuery("#dscTable,#dscTable_psiw").find("tr[acc='" + oneClustInfo[0] + "'] a.txid.clust").each(function(index) {                
                        jQuery(this).text(taxid);
                        taxLink = jQuery(this).attr("href").replace(/id=.*$/,"id="  + taxid);
                        if(taxLink) {
                            jQuery(this).attr("href",taxLink);
                        }
                        jQuery(this).attr("target",target);
                        jQuery(this).attr("title",title + taxid);
                    });        

                    jQuery("#dscTable,#dscTable_psiw").find("tr[acc='" + oneClustInfo[0] + "'] a.sciName.clust").each(function(index) {                
                        jQuery(this).text(sciName);
                        if(taxLink) {
                            jQuery(this).attr("href",taxLink);
                        }
                        jQuery(this).attr("target",target);
                        jQuery(this).attr("title",title + sciName);
                    });   
                    jQuery("#dscTable,#dscTable_psiw").find("tr[acc='" + oneClustInfo[0] + "'] div.popDl.clust h3 div.csn").each(function(index) {                
                        jQuery(this).text(sciName);                        
                    });                       
                    jQuery("#dscTable,#dscTable_psiw").find("tr[acc='" + oneClustInfo[0] + "'] a.cmnName.clust").each(function(index) {                
                        jQuery(this).text(cmnName);
                        if(taxLink) {
                            jQuery(this).attr("href",taxLink);
                        }
                        jQuery(this).attr("target",target);
                        jQuery(this).attr("title",title + cmnName);
                    });                           
                }                                          
            }
        }            
        jQuery("#dscTable,#dscTable_psiw").find("th").each(function(index) {                
            if(jQuery(this).hasClass("clustDyn")) {
                jQuery("#dscTable,#dscTable_psiw").ncbigrid("showColumn", index + 1);        
            }
        });  
        calcVarColumnsWidth();
        adjustColwidth();      
    };
    rp.onError = function(obj) {
        console.log("getClusterSummaryInfo: getDBInfo.cgi error, params: " + params);        
    }
    
    var accList = "";
    jQuery("#dscTable,#dscTable_psiw").find("tr").each(function(index) {                    
        if(jQuery(this).attr("acc")) {
            if(accList != "") accList += ",";
            accList += jQuery(this).attr("acc");
        }
    });   
    var params = "CMD=getClusterSummary&CLUST_DB_ACC_LIST=" + accList;
    
    if(jQuery("#filterClustTaxidsIncl") && jQuery("#filterClustTaxidsIncl").val() != "") {
        params += "&CLUST_INCLUDE_TAXIDS=" + jQuery("#filterClustTaxidsIncl").val();
    }
    if(jQuery("#filterClustTaxidsExcl") && jQuery("#filterClustTaxidsExcl").val() != "") {
        params += "&CLUST_EXCLUDE_TAXIDS=" + jQuery("#filterClustTaxidsExcl").val();
    }
        
    rp.Request(params,"POST");    
}


function initDescrTableScroll() 
{
    calcVarColumnsWidth();    
    jQuery(".scrollR").hide();             
    jQuery(".scrollL").hide();
    adjustColwidth();    
    jQuery(".scrR,.scrL").click(function(e){
        var scrollInterval = jQuery(this).hasClass("scrR") ? 20 : -20;
       jQuery(".scrollBody").scrollLeft(jQuery(".scrollBody")[0].scrollLeft + scrollInterval);
        
        var scrWidth = jQuery("#dscTable").width() - jQuery("#scrollBody").width();
        if(jQuery(".scrollBody")[0].scrollLeft == 0) {                
            jQuery(".scrollL").hide();                
        }
        else {                
            jQuery(".scrollL").show();    
        }
        if(jQuery(".scrollBody")[0].scrollLeft + scrollInterval < scrWidth) {                
            jQuery(".scrollR").show();
        }
        else {                
            jQuery(".scrollR").hide();
        }        
        
        utils.preventDefault(e);
    });
    jQuery(window).bind("scroll",positionScrollArrows);        
    positionScrollArrows();    
}

function  initScrollArrows()
{
    var showScrollArrow = false;    
    var descrHdr = jQuery("#dscTable").find("th.table-text-descr")[0];//c2    
    if(jQuery(descrHdr).is(":visible")) {         
        if(!jQuery("#dscTable").attr("minwidth")) {            
            showScrollArrow = checkScrollArrows(descrHdr);
        }            
    }
    else {               
       jQuery("#dscTable").find("th.table-text").each(function(index) {                        
            if(!showScrollArrow) {
                if(jQuery(this).is(":visible")) {         
                    if(!jQuery("#dscTable").attr("minwidth")) {
                        showScrollArrow = checkScrollArrows(this);
                    }          
                }
            }            
        });        
    }
    if(showScrollArrow) {
        //Add psiScroll
        jQuery(".scrollR").show();
    }
    
    if(jQuery("#dscTable").attr("minwidth") && (jQuery("#dscTable").parent().width() - parseInt(jQuery("#dscTable").attr("minwidth")) > 5) ) {                
        //Add psiScroll
        resetDescrTableWidth();        
    }        
}


function calcTableCellTextWIdth(tdElem,numberOfChars)
{
    var linkElem =jQuery(tdElem).find('a')[0];
    var saveTxt = jQuery(linkElem).text();
    var num = 0;
    var calcTxt = "";
    //Create string abcdefg... limitted by numberOfChars
    do {
        for (i = 97; i <= 122; i++) {
            calcTxt += String.fromCharCode(i);
            num++;
            if(num > numberOfChars) break;
        }
    }
    while (num < numberOfChars);
    jQuery(linkElem).text(calcTxt);
    var textWidthCalc = getHTMLTextWidth(tdElem);
    jQuery(linkElem).text(saveTxt);
    return(textWidthCalc);
}


function InitColMaxAndMinlWidth(numrows, colheaderID,thElem) //th: #c2,#c3,#c4, corresponding td have classe c2,c3,c4
{
    var combinedTextLen = 0;    
    var maxColTextLen = 0;
    var tdElem;
    jQuery("#dscTable,#dscTable_psiw").find("td." + colheaderID).each(function(index) {//td.c2        
        var textlen = jQuery(this).text().length;        
        maxColTextLen = Math.max(textlen,maxColTextLen);                        
        combinedTextLen += textlen;               
        tdElem = this;
     });                  
     var averageTextLen = parseInt(combinedTextLen/numrows);          
     var averageWidthCalc = calcTableCellTextWIdth(tdElem,averageTextLen);     
    var maxColWidthCalc = calcTableCellTextWIdth(tdElem,maxColTextLen);
   
    //console.log("averageWidth:" + averageWidth + " averageWidthCalc:" + averageWidthCalc + " averageWidthChar:" + averageWidthChar + " averageRatio:" + averageRatio + " calcAverWidth:" + calcAverWidth);    
    jQuery(thElem).attr("minwidth",averageWidthCalc * 0.7); //#c2    
    jQuery(thElem).attr("maxwidth",maxColWidthCalc); //#c2    
}


function calcVarColumnsWidth()
{
    
    var numrows = jQuery("#dscTable,#dscTable_psiw").find("tr.dflLnk").length;
    jQuery("#dscTable,#dscTable_psiw").find("th.table-text-descr,th.table-text").each(function(index) {//td.c2
        var col = jQuery(this).attr("col");
        InitColMaxAndMinlWidth(numrows, col,this);
    });            
}


function resetDescrTableWidth()
{
    jQuery("#dscTable,#dscTable_psiw").css("width", "100%");
    jQuery("#dscTable,#dscTable_psiw").removeAttr("minwidth")
    jQuery(".scrollR").hide();
    jQuery(".scrollL").hide();        
}

function setPsiTableTHWidth(colNum,width)
{
    if($("psiw")) {
        var thElem = jQuery("#dscTable_psiw").find("th." + colNum)[0];//c2
        if(thElem) {
            if(jQuery(thElem).hasClass("table-text-descr")) {            
                jQuery(thElem).width(width);                     
            }
            else {
                jQuery(thElem).css('width',width);       
            }            
        }
    }
}


function setTableTextColWidth(thElem, width) 
{
    var prc = (width/jQuery("#dscTable").width()*100 + 1);                
    jQuery(thElem).css('width',prc + '%');
    //Set the same width for PSI BLAST worse aligns table        
    var colNum = jQuery(thElem).attr("col");
    setPsiTableTHWidth(colNum,prc + '%');                
}        
                

function adjustColwidth()
{
    var fixedColFidth = 0; //length of all fixed columns
    var szAdjustDescr = 0;
    var descrColWidth = 0;
    jQuery("#dscTable").find("th.fixed").each(function(index) {                        
        if(jQuery(this).is(":visible")) {
            fixedColFidth += jQuery(this).width();
        }
    });        
    var varColumnsWidth = jQuery("#dscTable").width() - fixedColFidth;
    var descrHdr = jQuery("#dscTable").find("th.table-text-descr")[0];//c2 - descriptions        
    var numAdjustWidthCol = jQuery("#dscTable").find("th.table-text:visible").length;
    //sz indicates what part of variable table length descr colums takes
    var szAdjustDescr = parseFloat(jQuery(descrHdr).attr("sz"));
    var maxDescrWidth = parseFloat(jQuery(descrHdr).attr("maxwidth"));    
    var szAdjust = 0;
    if(jQuery(descrHdr).is(":visible")) {                 
        jQuery("#dscTable").find("th.table-text").each(function(index) {                        
            if(jQuery(this).is(":hidden")) {
                szAdjustDescr += parseFloat(jQuery(this).attr("sz"));
            }        
        });            
        descrColWidth = szAdjustDescr * varColumnsWidth; //Descr col width
        if( (descrColWidth - maxDescrWidth) > 20) {             
            modSzAdjustDescr = maxDescrWidth/varColumnsWidth;            
            szAdjust = parseFloat((szAdjustDescr - modSzAdjustDescr)/numAdjustWidthCol);
            descrColWidth = maxDescrWidth;
        }
    }        
    jQuery("#dscTable").find("th.table-text:visible").each(function(index) {                        
        var width;
        if(jQuery(descrHdr).is(":visible")) {                     
            width = (parseFloat(jQuery(this).attr("sz")) + szAdjust) * varColumnsWidth;
            delta = width - parseFloat(jQuery(this).attr("maxwidth"));
            if(delta > 0) {
                width = parseFloat(jQuery(this).attr("maxwidth"));
                delta = (szAdjust != 0) ? delta*0.5 : delta;
                descrColWidth += delta;
                if(szAdjust != 0)  width += delta;                    
            }                       
        }
        else {
            szAdjust = parseFloat(szAdjustDescr/numAdjustWidthCol);
            width = (parseFloat(jQuery(this).attr("sz")) + szAdjust) * varColumnsWidth; 
        }     
        setTableTextColWidth(this, width);            
    });          
    if(jQuery(descrHdr).is(":visible")) {        
        setTableTextColWidth(jQuery(descrHdr), descrColWidth);        
    }
          
    initColumnsTitle();
    initScrollArrows();    
}

function initColumnsTitle()
{
    var numChecked = 0,numCheckboxes = 0;
    jQuery("#dsConfig").find("input[type='checkbox']").each(function(index) {                
        li = jQuery(this).closest('li')
        if(li && !jQuery(li).hasClass("hidden")) {
            if(this.checked) {
                numChecked++;
            }    
            numCheckboxes++;            
        }
    });
    
    var title = (numChecked < numCheckboxes) ? "Select columns" : "Manage columns";        
    jQuery("#btndsConfig span").html(title);
}

function checkScrollArrows(thElem) //c2
{
    var showScrollArrow = false;
    width = jQuery(thElem).width();            
    if(width <= parseInt(jQuery(thElem).attr("minwidth"))) {        
        var tbWidth = parseInt(jQuery("#dscTable").width());
        jQuery("#dscTable,#dscTable_psiw").attr("minwidth",tbWidth);
        tbWidth += 10;
        jQuery("#dscTable,#dscTable_psiw").width(tbWidth);
        //console.log("dscTable set width: " + tbWidth + " from " + jQuery(thElem).attr("col"));        
        showScrollArrow = true;
    }    
    return showScrollArrow;
}

function positionScrollArrows() 
{

    jQuery("#tabDescr").find("#dscTable,#dscTable_psiw").each(function(index) {                        
        numrows = jQuery(this).find("tr.dflLnk").length;
        if(numrows > 0) {
            var pos = getScrollTablePos(this); //elem - table element   
            var scrollRightID = (this.id == "dscTable") ?  "#scrollR" : "#scrollR_psi";
            var scrollLeftID = (this.id == "dscTable") ?  "#scrollL" : "#scrollL_psi";
            jQuery(scrollRightID).css("top",pos);
            jQuery(scrollLeftID).css("top",pos);    
        }
    });           
}



function getScrollTablePos(elem) //elem - table element
{
    var elementTop = jQuery(elem).offset().top;
    var elementBottom = elementTop + jQuery(elem).outerHeight();
    var viewportTop = jQuery(window).scrollTop();
    var viewportBottom = viewportTop + jQuery(window).height();
    
    var pos;
    if(elementTop <= viewportTop && elementBottom >= viewportBottom) {
        //middle of the screen                
        pos = (viewportBottom - viewportTop)/2 + viewportTop - elementTop;                         
    }
    else if (elementTop >= viewportTop && elementBottom <= viewportBottom) {//the whole table is on the screen
        //middle of the table        
        pos = jQuery("#dscTable").height()/2;        
    }
    else if(viewportBottom > elementBottom) {
        //middle of the visible upper part of the table
        pos = (viewportTop - elementTop) + (elementBottom - viewportTop)/2;        
    }
    else {
        //middle of the visible bottom part of the table
        pos = (viewportBottom - elementTop)/2;        
    }    
    //viewportTop - elementTop - upper part that is off the screen        
    //(viewportBottom - elementBottom) - bottom part that is not table
    //viewportBottom - viewportTop - visible part of the window
    // (viewportBottom - viewportTop) - (viewportBottom - elementBottom) - visible part of the table        
    return pos;
};



