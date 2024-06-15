module.exports={


GetBallotPreferenceCount: function(options,ballots){
    console.log(options);
    var preferenceRanking={};
    for (var ballot in ballots){
        console.log(ballots[ballot].ranking);
        let ballotkey={}
        var ranking=ballots[ballot].ranking;
        var keys = Object.keys(ranking);
        var i, len=keys.length;
        keys.sort()
        var sortedDict = [];
        for (i=0;i<len;i++){
            k=keys[i];
            sortedDict.push({'key':k,'value':ranking[k]});
        }
        console.log(sortedDict);
    }

    return;




}//close function



















}