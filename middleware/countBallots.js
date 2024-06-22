module.exports={


GetBallotPreferenceCount: function(options,ballots){
    console.log(options);
    var preferenceRanking={};
    let ballotkey={};   

    for (var ballot in ballots){
        console.log(ballots[ballot].ranking);
        
        var ranking=ballots[ballot].ranking;
        var entries = Object.entries(ranking);
        var i, len=entries.length;
        //console.log(entries)
        entries.sort( function(a, b) {
            return a[1] - b[1];
          });
        console.log(entries);
        if (entries in ballotkey){
            ballotkey[entries]=ballotkey[entries]+1
        }
        else{
            ballotkey[entries]=1
        }
        console.log(ballotkey)
    }

    return ballotkey;
}







}