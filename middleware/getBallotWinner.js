module.exports={


    GetBallotWinner: function(type,options,ballots){
        console.log(options);
        var sortedballotArray=[]  
    
        for (var ballot in ballots){
            console.log(ballots[ballot].ranking);
            
            var ranking=ballots[ballot].ranking;
            var entries = Object.entries(ranking);
            var i, len=entries.length;
            //console.log(entries)
            entries.sort( function(a, b) {
                return a[1] - b[1];
              });
            //console.log(entries);
            sortedballotArray.push(entries)
        }
        console.log(sortedballotArray)
        if (type=="irv"){
            console.log("INSTANT RUNOFF")
            var topballotpoints={}
            for (var i=0;i<options.length;i++){
                topballotpoints[options[i]]=0
            }
            for (ballot in sortedballotArray){
                ballotarray=sortedballotArray[ballot];
                //console.log("array",ballotarray)
                var pick=0
                var ballotcounted=false;
                while (pick<ballotarray.length && !ballotcounted){
                    var option=ballotarray[pick][0]
                    //console.log("check option",option)
                    if (option in topballotpoints){
                        topballotpoints[option]+=1;
                        //console.log("Vote added for ",option)
                        ballotcounted=true;
                    }
                    pick++
                }
            }
            console.log(topballotpoints)
            var totalvotes=sortedballotArray.length
            console.log("total votes=",totalvotes)
            for (key in topballotpoints){
                if (topballotpoints[key]*2>totalvotes){
                    console.log("WINNER=",key)
                }
            }
        }
        else if (type=="cpl"){
            console.log("PAIRWISE COMPARISON")
            var pairwisepoints={}
            for (var i=0;i<options.length;i++){
                pairwisepoints[options[i]]=0
            }
            console.log(pairwisepoints)
        }




        return;
    }
    
    
    
    
    
    
    
    }