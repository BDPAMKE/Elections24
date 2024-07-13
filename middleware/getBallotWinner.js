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
            var winner=false;
            while (!winner && Object.keys(topballotpoints).length>0){
                if (topballotpoints.length==1){
                    console.log("Last one left:",Object.keys(topballotpoints)[0])
                    return
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
                        winner=true;
                        return
                    }
                }
                var keys   = Object.keys(topballotpoints);
                const [[match, lowestVal]] = Object.entries(topballotpoints).sort(function ([,valA], [,valB]) { return valA - valB });
                console.log("ELIMINATE?",match)
                if (!winner){
                    for (key in keys){
                        if (keys[key]==match){
                            delete topballotpoints[match]
                        }
                        else{
                            topballotpoints[keys[key]]=0
                        }
                    }
                }
            }
        }
        else if (type=="cpl"){
            console.log("PAIRWISE COMPARISON")
            //set pairwise points for determining who wins how many pairwise comparisions
            var pairwisepoints={}
            for (var i=0;i<options.length;i++){
                pairwisepoints[options[i]]=0
            }
            //console.log(pairwisepoints)
            for (var i=0;i<options.length;i++){
                for (var j=i+1;j<options.length;j++){
                    var optioni=options[i]
                    var optionj=options[j]
                    //console.log(options[i],options[j])      //Identify pairs to compare...
                    var ivotes=0;
                    var jvotes=0;
                    for (b in ballots){
                        var ranking=ballots[b].ranking;
                        //console.log(ballots[b].ranking);
                        if (optioni in ranking){
                            if (!(optionj in ranking)){
                                ivotes++; //if only the i option is in the ranking, i gets the vote for the ballot
                            }
                            else{
                                if (ranking[optioni]<ranking[optionj]){
                                    ivotes++
                                }
                                else{
                                    jvotes++
                                }
                            }
                        }
                        else {
                            if (optionj in ranking){
                                jvotes++
                            }
                        }
                    }
                    //console.log(optioni,ivotes,optionj,jvotes)
                    if (ivotes>jvotes){
                        pairwisepoints[optioni]++
                    }
                    else if (jvotes>ivotes){
                        pairwisepoints[optionj]++
                    }
                    else{
                        pairwisepoints[optioni]+=0.5
                        pairwisepoints[optionj]+=0.5
                    }
                }//j loop
            }//i loop
            console.log(pairwisepoints)
            var keys   = Object.keys(pairwisepoints);
            const [[winner, lowestVal]] = Object.entries(pairwisepoints).sort(function ([,valA], [,valB]) { return valB - valA });
            console.log("Winner",winner)
        }




        return;
    }
    
    
    
    
    
    
    
    }