 // down arrow click - jquery
    var $j = jQuery.noConflict();
    
    function formFn() {
        $j('html, body').animate({
            scrollTop: $j(".form-select").offset().top
        }, 1000)
    }
    function receiptFn() {
        var receipt_div = document.querySelector('.receipt');
        receipt_div.style.display = "block"
        $j('html, body').animate({
            scrollTop: $j(".receipt").offset().top
        }, 1000)
    }
    function upFn() {
        $j('html, body').animate({
            scrollTop: $j(".home").offset().top
        }, 1000)
    }

    function onScroll(event){
        var scrollPos = $j(document).scrollTop();
        $j('i').each(function () {
            var currLink = $j(this);
            var refElement = $j(this.hash); 
            if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $j('i').removeClass("active");
                currLink.addClass("active");
            }
            else{
                currLink.removeClass("active");
            }
        });
    }

    

    function addOption(o,nw){
        var v = nw;
        if(v == 'Select One...') v = '';
        o.options[o.options.length] = new Option(nw, v, false, false);
    }

    function init(){

        var os = document.getElementById('os');
        var ve = document.getElementById('ve');
        var co = document.getElementById('co');
        var genome = document.getElementById('genome');
        var g2 = document.getElementById('g2');
        var ph2 = document.getElementById('ph2');
        var bv = document.getElementById('bv');
        var bv2 = document.getElementById('bv2');
        var sub2 = document.getElementById('sub2');
        var r1 = document.getElementById('r1');
        var ex = document.getElementById('ex');
        var ex2 = document.getElementById('ex2');
        var submit = document.getElementById('submit');
        var add2 = document.getElementById('add2');
     


        bv2.style.display = "none";
        sub2.style.display = "none";
        add2.style.display = "none";



        os.addEventListener("change", function(){
            ve.options.length = 0;
            co.options.length = 0;
            var sel = os.options[os.selectedIndex].value;
            if(sel == 'Leuk AML'){
                addOption(ve,'NOV-2017');
                addOption(co,'2017');

            } 

            if(sel == 'Leuk Cell line'){
                addOption(ve,'NOV-2019');
                addOption(co,'2019');

            } 
        });

            genome.addEventListener("change", function(){
            g2.options.length = 0;

            var sel = genome.options[genome.selectedIndex].value;
            if(sel == 'GRCh38'){
                addOption(g2,'Gencode v23 Transcriptome');
                addOption(g2,'Ensembl GRCh38 v89 Transcriptome');


            } else if (sel == 'GRCh37'){
                addOption(g2,'Gencode v23lift37 Transcriptome');
                addOption(g2,'Ensembl GRCh37 v67 Transcriptome');
            
            }
        });



        bv.addEventListener("change", function(){
            document.getElementById('add2').style.display = "block";
        });



        ph2.addEventListener("change", function(){
            var sel = ph2.options[ph2.selectedIndex].value;
            bv.options.length = 0;
            bv2.options.length = 0;
            add2.style.display = 'none';
            bv2.style.display = 'none';
            sub2.style.display = 'none';

            if (sel == 'RNA'){
                addOption(bv,'Select One...');
                addOption(bv,'Kallisto: 0.44.0');
                addOption(bv,'Kallisto: 0.43.1');
                addOption(bv,'Salmon: 11.3');
                addOption(bv,'Salmon: 11.2');


            }
        });




        add2.addEventListener("click", function(){
            bv2.options.length = 0;
            var sel = ph2.options[ph2.selectedIndex].value;
            var sel2 = bv.options[bv.selectedIndex].value;
            document.getElementById('bv2').style.display = "block";
            document.getElementById('sub2').style.display = "block";

            if (sel == 'RNA'){
                if(sel2 != 'Kallisto: 0.44.0') { 
                    if(sel2 == 'Salmon: 11.3'){
                    addOption(bv2,'Kallisto: 0.44.0');
                    addOption(bv2,'Kallisto: 0.43.0');
                    bv.options.length = 0;
                    addOption(bv,'Salmon: 11.3');
                    }else if (sel2 == 'Salmon: 11.2'){
                    addOption(bv2,'Kallisto: 0.44.0');
                    addOption(bv2,'Kallisto: 0.43.0');
                    bv.options.length = 0;
                    addOption(bv,'Salmon: 11.3');

                    }
                    else {
                    addOption(bv2,'Kallisto: 0.44.0');
                    addOption(bv2,'Salmon: 11.3');
                    addOption(bv2,'Salmon: 11.2');
                    bv.options.length = 0;
                    addOption(bv,'Kallisto: 0.43.1');}
                }
                if(sel2 != 'Kallisto: 0.43.1'){
                    if(sel2 == 'Salmon: 11.3'){
                    addOption(bv2,'Salmon: 11.2');
                    bv.options.length = 0;
                    addOption(bv,'Salmon: 11.3');
                    }else if (sel2 == 'Salmon: 11.2'){
                    addOption(bv2,'Salmon: 1');
                    bv.options.length = 0;
                    addOption(bv,'Salmon: 11.2');
                    }else{
                    addOption(bv2,'Kallisto: 0.43.1');
                    addOption(bv2,'Salmon: 11.3');
                    addOption(bv2,'Salmon: 11.2');
                    bv.options.length = 0;
                    addOption(bv,'Kallisto: 0.44.0');}
                }  




            }            
        });




        sub2.addEventListener("click", function(){  // remove second version


            var sel3 = ph2.options[ph2.selectedIndex].value;

            bv2.options.length = 0;
            bv2.style.display = 'none';
            sub2.style.display = 'none';
            
            bv.options.length = 0;
           if (sel3 == 'RNA'){
                addOption(bv,'Select One...');
                addOption(bv,'Kallisto: 0.44.0');
                addOption(bv,'Kallisto: 0.43.1');
                addOption(bv,'Salmon: 11.3');
                addOption(bv,'Salmon: 11.2');
            }

            document.getElementById('bvr').innerHTML = bv.options[bv.selectedIndex].value;

        });

        var progressBtn = document.getElementById('progress_btn');
        var progressElement = document.getElementById('progress_bar');
        var submitText = document.getElementById('submit_text');

        btn.addEventListener("click", function(){

            btn=document.getElementById('btn');
            prog=document.getElementById('progress');
            text=document.getElementById('text');

           
        prog.classList.add('anima');
            prog.addEventListener("transitionend", function(event) {
            text.textContent="PSet Submitted";
        }, false);




            document.getElementById('osr').innerHTML = os.options[os.selectedIndex].value;
            document.getElementById('genomer').innerHTML = genome.options[genome.selectedIndex].value;
            document.getElementById('g2r').innerHTML = g2.options[g2.selectedIndex].value;
            document.getElementById('verr').innerHTML = ve.options[ve.selectedIndex].value;
            document.getElementById('corr').innerHTML = co.options[co.selectedIndex].value;
            document.getElementById('phr2').innerHTML = ph2.options[ph2.selectedIndex].value;
            ele = document.getElementById("to");



            if(bv2.options.length > 0){
                document.getElementById('bvr').innerHTML = bv.options[bv.selectedIndex].value + "<br>" +
                                                     bv2.options[bv2.selectedIndex].value;
                bvr = bv.options[bv.selectedIndex].value + " " + bv2.options[bv2.selectedIndex].value
            } else {
                document.getElementById('bvr').innerHTML = bv.options[bv.selectedIndex].value;
                bvr = bv.options[bv.selectedIndex].value;
            }    



            // Making an AJAX call to the server
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/execute", true);
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp.send(JSON.stringify({
                osr: os.options[os.selectedIndex].value,
                genomer: genome.options[genome.selectedIndex].value,
                g2r: g2.options[g2.selectedIndex].value,
                verr: ve.options[ve.selectedIndex].value,
                corr: co.options[co.selectedIndex].value,
                phr2: ph2.options[ph2.selectedIndex].value,
                email: ele.value,
                bvr: bvr



               

            }));

        });

    }
    	
    window.addEventListener("DOMContentLoaded",init,false);
    