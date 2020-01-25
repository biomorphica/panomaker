        /* Input form that gathers 
             1) name of scene
             2) name of Author
             3) file path name
                a) auto generate from authorName/sceneName
                b) create a new folder
            4) Loop through pano shots
                a) image location (browse to it)
                b) name of location (optional)
                c) position of camera, x, y, z
            5) validate data in form.
                a) call this when [Add Another Panorama] is pressed. If any fields are empty, throw alert window,
                  colorize missing fields, and prevent new entries to be created until fields are all filled.
            6) [Submit] when pressed, validate data, then create a new networked pano file from the data.
                a) create a json file out of the input data. save it to file.
            --------------
            Additional features
            1) initial view and initial target
            2) initial settings for buttons, including
                a) identifier style s
                    i) blank, number only, name only, number and name
                    ii) cutoff distance to view other buttons
                    iii) transpanrency and color (same color, or different colors)
                */

       
        // Logo file
        // File Select
        // let logoDiv = document.querySelector('.logoinput');       
        // logoDiv.innerHTML ="<span class='logo'> Select a file: </span>  <input type='file' name='logofile' id='logo-input-file' class='browse-btn' accept='.jpg, .png' ><br>";
         
        // Load cam data
        // File Select
        // let loadCamDiv = document.querySelector('#loadcamfile');       
        // loadCamDiv.innerHTML ="<span class='logo'> Select a file: </span>  <input type='file' name='logofile' id='input-file' class='browse-btn' accept='.jpg, .png' ><br>  ";
        
         // ----------------------------- createPano ----------------------------
        // Add a new bank of input elements used to create a new Panorama.
        // Creates all the html and a pano object that has references to all the elements and their values.
        // Called from savePano() when a new pano button is clicked.
        function createPano(panoId) {
            //debugger
            // console.log('createPano');
            let pId = extractId(panoId)
           
            // Create a new Div, that will contain all the input fields.
            const divId = 'pano-'+(pId).toString()
            const prevId = 'pano-'+(pId-1).toString()
            const parentDiv = document.querySelector('#pano_data')
            const prevDiv = document.querySelector('#'+prevId)
            const mainDiv = divInserter( divId, parentDiv, prevDiv);
            mainDiv.setAttribute("class", "pano_maker")   

            // Pano number           
            let panoTitle = document.createElement('span')
            panoTitle.setAttribute('id', 'pano_maker_title-'+pId)
            panoTitle.setAttribute('class','pano_title')
            panoTitle.innerHTML = "<b>New Pano</b>" 
            mainDiv.appendChild(panoTitle)

            //  Message Panel
            let message = document.createElement('span')
            message.setAttribute('id', 'pano_message-'+pId)
            message.setAttribute('class', 'pano_message')
            mainDiv.appendChild(message)
            
            // Add Button
            let addButton = document.createElement('input')
            addButton.setAttribute('type', 'button')
            addButton.setAttribute('id', 'add_button-'+pId)
            addButton.setAttribute('class', 'add_button')
            addButton.setAttribute('value', 'Add' )
            addButton.setAttribute('onclick', 'savePano(this.id)' )
            mainDiv.appendChild(addButton)
                  
            // Select a file
            let fileDiv = divCreator('file_div', mainDiv);
            let selFile = document.createElement('span')
            fileDiv.appendChild(selFile)
            selFile.innerHTML = '<b>Select an Image File: </b>'
            selFile.setAttribute('class', 'title_row')
            // input file
            let id = 'input_file-'+pId  
            let imageInput = document.createElement('input')   
            imageInput.setAttribute('type', 'file')
            imageInput.setAttribute('name', 'pano'+pId)
            imageInput.setAttribute('id', 'input_file-'+pId)
            imageInput.setAttribute('class', 'browse_btn')
            imageInput.setAttribute('accept', '.jpg, .png')
            // imageInput.setAttribute('onchange', 'duplicateCheck(this.id)')
            imageInput.setAttribute('oninput', 'displayThumbnail(this)')
            fileDiv.appendChild(imageInput)
            // image file thumbnail
            let imageThumb = document.createElement('img')
            imageThumb.setAttribute('id', 'image_thm-'+pId)
            imageThumb.setAttribute('class', 'image_thm')
            fileDiv.appendChild(imageThumb)

            // View Name
            let nameDiv = divCreator('name_div', mainDiv);
            let paneSize = 40;
            // checkbox enable View Names
            let enableViewName = document.createElement('input')
            enableViewName.setAttribute('type', "checkbox")
            enableViewName.setAttribute('class', 'checkbox')
            enableViewName.setAttribute('id', 'view_name_enabled-'+pId)
            enableViewName.setAttribute('checked', 'true')
            enableViewName.setAttribute('onclick', 'viewNamesEnable(this.id)')
            nameDiv.appendChild(enableViewName)
            // Label
            let viewNameLabel = document.createElement('span')
            viewNameLabel.setAttribute('class', 'title_row')
            viewNameLabel.innerHTML = 'View Name:'
            nameDiv.appendChild(viewNameLabel)
            // Input
            let viewNameInput = document.createElement('input')
            viewNameInput.setAttribute('type', 'text')
            viewNameInput.setAttribute('size', paneSize)
            viewNameInput.setAttribute('class', 'title_row')
            viewNameInput.setAttribute('id', 'view_name-'+pId)
            viewNameInput.setAttribute('onchange', 'checkInput(this.id)')
            viewNameInput.setAttribute('oninput', 'duplicateCheck(this.id)')
            nameDiv.appendChild(viewNameInput)
           
            // Camera Position
            let camposDiv = divCreator('campos_div', mainDiv);
            camposDiv.setAttribute('class', 'cam_position')
            // console.log('camposDiv ',camposDiv)
            paneSize = 20;
            // checkbox enable View Names
            let enableCamPos = document.createElement('input')
            enableCamPos.setAttribute('type', "checkbox")
            enableCamPos.setAttribute('class', 'checkbox')
            enableCamPos.setAttribute('id', 'cam_pos_enabled-'+pId)
            enableCamPos.setAttribute('checked', 'true')
            enableCamPos.setAttribute('onclick', 'camPosEnable(this.id)')
            camposDiv.appendChild(enableCamPos)
            // Title
            let camPosTitle = document.createElement('span')
            camPosTitle.innerHTML = "Camera Position"
            camPosTitle.setAttribute('class', 'title_row')
            camposDiv.appendChild(camPosTitle)
            // pos x label
            let posxLabel = document.createElement('span')
            posxLabel.setAttribute('class', 'position_row')
            posxLabel.innerHTML = 'pos x:'
            camposDiv.appendChild(posxLabel)
            // pos x Input
            let posxInput = document.createElement('input')
            posxInput.setAttribute('type', 'number')
            posxInput.setAttribute('step', '0.1')
            posxInput.setAttribute('size', paneSize)
            posxInput.setAttribute('id', 'posx-'+pId)
            posxInput.setAttribute('onchange', 'checkInput(this.id)')
            camposDiv.appendChild(posxInput)
            // pos y label
            let posyLabel = document.createElement('span')
            posyLabel.setAttribute('class', 'position_row')
            posyLabel.innerHTML = 'pos y:'
            camposDiv.appendChild(posyLabel)
            // pos y Input
            let posyInput = document.createElement('input')
            posyInput.setAttribute('type', 'number')
            posyInput.setAttribute('step', '0.1')
            posyInput.setAttribute('size', paneSize)
            posyInput.setAttribute('id', 'posy-'+pId)
            posyInput.setAttribute('onchange', 'checkInput(this.id)')
            camposDiv.appendChild(posyInput)
            // pos z label
            let poszLabel = document.createElement('span')
            poszLabel.setAttribute('class', 'position_row')
            poszLabel.innerHTML = 'pos z:'
            camposDiv.appendChild(poszLabel)
            // pos z Input
            let poszInput = document.createElement('input')
            poszInput.setAttribute('type', 'number')
            poszInput.setAttribute('step', '0.1')
            poszInput.setAttribute('size', paneSize)
            poszInput.setAttribute('id', 'posz-'+pId)
            poszInput.setAttribute('onchange', 'checkInput(this.id)')
            camposDiv.appendChild(poszInput)

            // Delete Button
            let deleteButton = document.createElement('input')
            deleteButton.setAttribute('type', 'button')
            deleteButton.setAttribute('id', 'delete_button-'+pId)
            deleteButton.setAttribute('class', 'delete_button')
            deleteButton.setAttribute('value', 'Delete' )
            deleteButton.setAttribute('onclick', 'deletePano(this.id)' )
            camposDiv.appendChild(deleteButton)

            // pano object {elements, values}
            let pano = {
                elements: {  
                    main: mainDiv, 
                    title: panoTitle,   
                    message: message,       
                    addButton: addButton,
                    deleteButton: deleteButton,
                    inputFile: imageInput,
                    viewName: viewNameInput,
                    viewNameEnabled: enableViewName,                   
                    camPosEnabled: enableCamPos, 
                    posx: posxInput,
                    posy: posyInput,
                    posz: poszInput
                },
                values:{}
            }

            gPanos.push(pano);
            // console.log(pano);
            checkInput(gPanos.length-1)
            
            
        }   
        // ----------------------------  viewNamesEnable ------------------------ 
        // Checkbox enables (or disables) the View Name field
        function viewNamesEnable(id){            
            // console.log('viewNamesEnable: ', id)
            if(!id) {id =  event.srcElement.id}
            let vId =  extractId(id)
            // console.log('vId', vId)
            if (gPanos[vId].elements.viewNameEnabled.checked){
                // console.log('enable view names')
                gPanos[vId].elements.viewName.disabled = false
            } else {
                // console.log('disable view names')
                gPanos[vId].elements.viewName.disabled = true
            }
            checkInput(vId)
        }
        // ----------------------------  camPosEnable ------------------------ 
        // Checkbox enables (or disables) the Camera Pos fields
        function camPosEnable(id){
            // console.log('camPosEnable: ', id)
            if(!id) {id =  event.srcElement.id}
            let cId =  extractId(id)
            // console.log('cId', cId)
            if (gPanos[cId].elements.camPosEnabled.checked){
                // console.log('enable camera pos')
                gPanos[cId].elements.posx.disabled = false
                gPanos[cId].elements.posy.disabled = false
                gPanos[cId].elements.posz.disabled = false
            } else {
                // console.log('disable camera pos')
                gPanos[cId].elements.posx.disabled = true
                gPanos[cId].elements.posy.disabled = true
                gPanos[cId].elements.posz.disabled = true
            }
            // console.log('cId: ', cId)
            checkInput(cId)
        }
        // ----------------------------  checkInput ------------------------ 
        // Checks the fields for valid data. If everything is valid, Add button becomes enabled. 
        // Returns validation object.
        function checkInput(panoId) {
            let pId = extractId(panoId)
        //   console.log('checkInput ', pId)
            let val = getFormValidation(pId) 
            let clear = false // Does not flag invalid fields (outline in red), only clears valid fields from being flagged.          
            flagInvalidFields(val, clear)
            let addButton =  gPanos[pId].elements.addButton
            if (val.all.valid){
                //  console.log('add button enabled')             
                // gAddButton.className = 'add_button'
                addButton.style.color = '#86450f'
                addButton.style.backgroundColor = '#f0c769'    
                clearAllMessages()                   
                // gAddButton.disabled = false
                gbvaluesValid = true
            } else {                 
                // console.log('add button disabled')
                // gAddButton.className = 'add_button_disabled'
                addButton.style.color = '#757575'
                addButton.style.backgroundColor = '#e2e2e2'
                // gAddButton.disabled = true
                gbvaluesValid = false
            }
            return val    
         }
        // ---------------------------- clearAllMessages ------------------------
        function clearAllMessages(){
            // console.log('clearAllMessages')
            // console.log(gPanos)
            gPanos.forEach(pano => {
               pano.elements.message.innerHTML = ''
            })
         }

        // ---------------------------- getFormValidation ------------------------
        // Tests the input fields for the top level pano form.
        // Returns an object indicating which fields are valid, including whether all fields are valid
        function getFormValidation(panoId){  
            //   console.log("getFormValidation panoId: ", panoId)
            let pId = extractId(panoId)
            //   console.log(gPanos[pId])
            const reAnyTitle = /[\w]+/i;
            const reAnyNum = /[-\d\.]+/;
            const imageFileTest = reAnyTitle.test( gPanos[pId].elements.inputFile.value); 
            const viewNameValid = reAnyTitle.test( gPanos[pId].elements.viewName.value);
            const viewNameTest = !gPanos[pId].elements.viewNameEnabled.checked ||  viewNameValid;
            const camPosX = reAnyNum.test(gPanos[pId].elements.posx.value);
            const camPosY = reAnyNum.test(gPanos[pId].elements.posy.value);
            const camPosZ = reAnyNum.test(gPanos[pId].elements.posz.value);
            const camPosNumValid = ( camPosX && camPosY && camPosZ );
            const camPosEnabled = gPanos[pId].elements.camPosEnabled.checked
            const camPosTest = !camPosEnabled  || camPosNumValid;

            const imageFileValue = gPanos[pId].elements.inputFile.value.match(reAnyTitle)
            // console.log('imageFileValue', imageFileValue)
            const viewNameValue = gPanos[pId].elements.viewName.value.match(reAnyTitle)
            // console.log('viewNameValue', viewNameValue)
            const camPosXValue = gPanos[pId].elements.posx.value.match(reAnyNum)
            // console.log('camPosXValue', camPosXValue)
            const camPosYValue = gPanos[pId].elements.posy.value.match(reAnyNum)
            const camPosZValue = gPanos[pId].elements.posz.value.match(reAnyNum)
            const allValid = imageFileTest && viewNameTest && camPosTest
            // Create the object that contains validation data for each element
            const valObject = {
                image: {valid: imageFileTest, el: gPanos[pId].elements.inputFile}, 
                name: {valid: viewNameTest, el: gPanos[pId].elements.viewName}, 
                camx: {valid: camPosX || camPosTest, el: gPanos[pId].elements.posx}, 
                camy: {valid: camPosY || camPosTest, el: gPanos[pId].elements.posy}, 
                camz: {valid: camPosZ || camPosTest, el: gPanos[pId].elements.posz}, 
                camPos: {valid: camPosTest, el: null},
                all: {valid: allValid, el: null} 
            }
            // Parse the values of all the fields, if everything is valid
            if (allValid){
                // console.log('imageFileValue', imageFileValue)
                valObject.image.value = imageFileValue['input']
                if (gPanos[pId].elements.viewNameEnabled.checked){
                    valObject.name.value = viewNameValue[0]
                } else {
                    valObject.name.value = ''
                }
                if (gPanos[pId].elements.camPosEnabled.checked){
                    valObject.camx.value = camPosXValue[0]
                    valObject.camy.value = camPosYValue[0]
                    valObject.camz.value = camPosZValue[0]
                } else {
                    valObject.camx.value = pId
                    valObject.camy.value = '0'
                    valObject.camz.value = '0'
                }
            }
            return valObject
        }
        // ----------------------------- savePano ----------------------------
        // Called when Add/Save button is clicked. 
        // Add and Save are same button, but new panos are named Add and saved panos are named save.
        // Checks the top pano input fields for errors. If errors, throw alert with red highlighted fields, else
        // Create a copy of this input field and place below.
        // Reset the top input fields.
        function savePano(panoId) {
            // console.log('savePano()', panoId);
            pId = extractId(panoId)
            // console.log('pId: ', pId)
           
            let newPanoId = gPanos.length // Id of new pano to be created
            let curPanoId = gPanos.length-1 // Id of current pano being saved
            let btnType = "save" // Saved (already has a number label) Pano was clicked (to save edits)
            if (pId == curPanoId) { // Top Pano panel was clicked to Add new pano
                btnType = 'add' 
            }
            // console.log('btnType: ', btnType)
            const val = checkInput(pId)

            if (gbvaluesValid){ // All data validated (in checkInput) for current pano
                if( btnType === "add"){ // Add new pano
                    // Parse the data from the current pano fields and populate the pano object
                    populatePanoValues(pId)
                    
                    // Create the json object that contains all the pano data.
                    // Submit the json to the server. 
                    // submitData()

                    // Change some of the HTML of this newly saved pano, so it appears as a saved panel.
                    gPanos[curPanoId].elements.addButton.value = "Save"
                    gPanos[curPanoId].elements.addButton.style.color = '#757575'
                    gPanos[curPanoId].elements.addButton.style.backgroundColor = '#e2e2e2'
                    // Change the Title from New Pano to the current pano name.
                    gPanos[curPanoId].elements.title.innerHTML = '<b>Pano '+(curPanoId+1).toString()+'</b>'                
                    // Change the style of the saved Pano from green to gray.
                    let mainDiv = document.querySelector('#pano-'+curPanoId.toString())
                    if (curPanoId%2 == 0){
                        mainDiv.setAttribute('class', 'pano_b');
                    } else {
                        mainDiv.setAttribute('class', 'pano_a');
                    }
                
                    // Reveal the delete button.
                    gPanos[curPanoId].elements.deleteButton.style.display = "block"
                    
                    // Create a new pano panel,  html set and pano object populated with elements refs and values.
                    createPano(newPanoId)

                    // enable Make Panos button
                    const mpb = document.querySelector('#submit_button')
                    console.log(mpb.getAttribute('disabled'))
                    mpb.setAttribute('class', 'submit_button')
                    mpb.disabled = false
                    console.log(mpb)

                } else { // Save Pano edits
                    // Set the Save button back to gray
                    gPanos[pId].elements.addButton.style.color = '#757575'
                    gPanos[pId].elements.addButton.style.backgroundColor = '#e2e2e2'
                    // Save edited Pano Data

                }

                // Rebuild the VR world
    
                // Reset all the fields in the top level pano
            } else { // Some fields were not valid
                // Hilight fields in error
                // console.log('pano '+pId+' has invalid fields')
                let val = getFormValidation(pId)
                flagInvalidFields(val, true)
                // Throw error message

            }        
        }
        // ----------------------------- loadPano ----------------------------
        // Creates the html elements for a new pano, that was loaded from file
        function loadPano(panoObjects){
            console.log('loadPano', panoObjects)
            const filePath = panoObjects.panoPath            
            let newPanoId = gPanos.length
            console.log(panoObjects.data)
            const panos = Object.values(panoObjects.data)
            console.log('panos', panos, typeof panos, panos.length)
            const panoBaseId = gPanos.length-1
            let panoIdNum 
            Object.values(panos).forEach(pano => { 
                //  debugger
                panoIdNum = panoBaseId + Number(pano.id)
                console.log('pano', pano)
                // Populate New Pano with loaded values
                //panoIdNum = Number(pano.id) + panoBaseId - 1
                let curPano = gPanos[ panoIdNum -1 ]
                if (panoIdNum %2 == 0){
                    curPano.elements.main.setAttribute('class', 'pano_a')
                } else {
                    curPano.elements.main.setAttribute('class', 'pano_b');
                }
               
                curPano.elements.message.innerHTML = filePath
                curPano.elements.title.innerHTML = "<b>Pano "+pano.id+"</b>"
                // curPano.elements.addButton.value = "Save"
                curPano.elements.addButton.setAttribute("hidden", true)
                curPano.elements.deleteButton.style.display = "block"
                curPano.elements.viewName.setAttribute('value', pano.name)
                curPano.elements.inputFile.setAttribute('value', pano.file)
                curPano.elements.posx.setAttribute('value', pano.x) 
                curPano.elements.posy.setAttribute('value', pano.y) 
                curPano.elements.posz.setAttribute('value', pano.z)
                curPano.elements.inputFile.setAttribute('onchange', 'input_file-'+newPanoId)
                // Create new Pano                  
                // pano object {elements, values}
                let newPano = {
                    elements: {  
                        main: curPano.elements.main, 
                        title: curPano.elements.title,   
                        message: curPano.elements.message,       
                        addButton: curPano.elements.addButton,
                        deleteButton: curPano.elements.deleteButton,
                        inputFile: curPano.elements.inputFile,
                        viewName: curPano.elements.viewName,
                        viewNameEnabled: curPano.elements.viewNameEnabled,                   
                        camPosEnabled: curPano.elements.camPosEnabled, 
                        posx: curPano.elements.posx,
                        posy: curPano.elements.posy,
                        posz: curPano.elements.posz
                    },
                    values:{}
                }

                // gPanos.push(newPano);
          
                // Create New Pano panel
                createPano(gPanos.length)
            })

            // Enable Make Panos button
            const makePanoBtn = document.querySelector('#submit_button')
            makePanoBtn.disabled = false
            makePanoBtn.setAttribute('class', 'submit_button')
            console.log(makePanoBtn)

        }
        // ----------------------------- duplicateCheck ----------------------------
        // Checks all the previously made panos to see if new pano is a duplicate.
        function duplicateCheck(elId){
            console.log('duplicateCheck ', elId)
            // debugger
            // Get name of ID
            let elType = elId.match(/\w+/i)[0]
            // console.log('element type ', elType)
            let pId = elId.match(/\d+/)[0]
            // console.log('pano ID: ', pId)
            let elemToTest = document.querySelector('#'+elId)
            let elemVal = elemToTest.value
            const messageEl = document.querySelector('#pano_message-'+pId)
            if (gPanos.length > 1){
                for (let i=0; i<gPanos.length-1; i++){
                    if(elType == 'input_file'){                       
                        if ((gPanos[i].elements.inputFile.value == elemVal) && 
                        (gPanos[i].elements.inputFile.id !== elId)){
                            // console.log('Your Image File choice is the same as pano '+ (i+1).toString() )
                            messageEl.innerHTML = 'Your image file choice is the same as pano '+ (i+1).toString()
                            elemToTest.style.borderColor =  '#ff4400'
                            elemToTest.style.borderWidth = 'medium' 
                            break
                        } else {
                            messageEl.innerHTML = ''
                            elemToTest.style.borderColor = '#aaaaaa'
                            elemToTest.style.borderWidth = 'thin'     
                        }
                    } else if (elType == 'view_name'){
                        console.log('view_name ', gPanos[i].elements.viewName.value, elemVal)
                        if ( (gPanos[i].elements.viewName.value == elemVal) && 
                        (gPanos[i].elements.viewName.id !== elId) ){
                            // console.log('Your View Name choice is the same in pano '+ (i+1).toString() )
                            messageEl.innerHTML = 'Your View Name  choice is the same as pano '+ (i+1).toString()
                            elemToTest.style.borderColor =  '#ff4400'
                            elemToTest.style.borderWidth = 'medium' 
                            break
                        }  else {
                            messageEl.innerHTML = ''
                            elemToTest.style.borderColor = '#aaaaaa'
                            elemToTest.style.borderWidth = 'thin'   
                        }
                    }
                }
            }
        }
        // ----------------------------- displayThumbnail ----------------------------
        // 
        function displayThumbnail(el){
            console.log('displayThumbnail', el)
            const file = el.files[0]
            // console.log(file)
            const id = el.id.match((/\d+/))[0]
            // console.log(id)
            const imgThmEl = document.querySelector('#image_thm-'+id)
            const reader = new FileReader()
            reader.onload = function(event){
                imgThmEl.src = event.target.result
            }
            reader.readAsDataURL(file)
            console.log(imgThmEl)
            // Clear message 
            const messageEl = document.querySelector('#pano_message-'+id)
            messageEl.innerHTML = ''
            duplicateCheck(el.id)
        }
       // ----------------------------- populatePanoValues ----------------------------
       // Populate the pano.values with data from all the html elements
       function populatePanoValues(curPanoId){
        //    console.log('populatePanoValues',curPanoId )
        //    console.log('gPanos', gPanos)
        gPanos.forEach(pano => {
            pano.values.inputFile = pano.elements.inputFile.value
            pano.values.viewName = pano.elements.viewName.value
            pano.values.inputFile = pano.elements.inputFile.value
            pano.values.posx = pano.elements.posx.value
            pano.values.posy = pano.elements.posy.value
            pano.values.posz = pano.elements.posz.value
        })
       }
      
       // ----------------------------- flagInvalidFields ----------------------------
       // check all the fields in the top pano panel and flag (outline in red) invalid fields.
       // clear: if false, does not flag invalid fields, but only removes flag from valid fields
       function flagInvalidFields( val, clear ){
            // console.log('flagInvalidFields')
            // console.log('validatedFormObject', val)
            for (const prop in val){
                // console.log(prop, val[prop])
                let valObject = val[prop]
                // console.log('element: ', valObject.el)
                if (valObject.el){
                    // console.log('valid: ', valObject.valid)
                    if (valObject.valid){                            
                        valObject.el.style.borderColor = '#aaaaaa'
                        valObject.el.style.borderWidth = 'thin'                  
                    } else {        
                        if (clear){
                             valObject.el.style.borderColor =  '#ff4400'
                             valObject.el.style.borderWidth = 'medium' 
                        }  
                    }
                }
            }
        }
       
        // ----------------------------- deletePano ----------------------------
        let deletePano = function(panoId){
            // console.log('deletePano ', panoId)
            debugger
            let dId = extractId(panoId)
            // console.log('dId: ', dId)
            // console.log('pano to be deleted: ' , gPanos[pId]);
           
            let r = confirm("Do you want to delete pano "+(Number(dId)+1).toString()+"?");
            if (r == true){
                // delete this html and object.
                // console.log('gPanos.length:', gPanos.length, gPanos);
                let m = gPanos[dId].elements.main;
                // console.log(m);
                while (m.firstChild){
                    m.removeChild(m.firstChild);
                }
                m.parentNode.removeChild(m)
                // console.log(m);
                gPanos.splice(dId, 1);
                 // delete gPanos[dId]
                // console.log('gPanos.length:', gPanos.length, gPanos);
                // Change the id of the new pano to be current
                let curPanoId = gPanos.length-1
                // console.log(gPanos[curPanoId])
                gPanos[curPanoId].elements.main.setAttribute('id', 'pano-'+curPanoId)
                gPanos[curPanoId].elements.title.setAttribute('id', 'pano_maker_title-'+curPanoId)
                gPanos[curPanoId].elements.addButton.setAttribute('id', 'add_button-'+curPanoId)
                gPanos[curPanoId].elements.deleteButton.setAttribute('id', 'delete_button-'+curPanoId)
                gPanos[curPanoId].elements.inputFile.setAttribute('id', 'input_file-'+curPanoId)
                gPanos[curPanoId].elements.camPosEnabled.setAttribute('id', 'cam_pos_enabled-'+curPanoId)
                gPanos[curPanoId].elements.posx.setAttribute('id', 'posx-'+curPanoId)
                gPanos[curPanoId].elements.posy.setAttribute('id', 'posy-'+curPanoId)
                gPanos[curPanoId].elements.posz.setAttribute('id', 'posz-'+curPanoId)
                gPanos[curPanoId].elements.viewName.setAttribute('id', 'view_name-'+curPanoId)
                gPanos[curPanoId].elements.viewNameEnabled.setAttribute('id', 'view_name_enabled-'+curPanoId)
            
            }
        }
        // ------------------------------ removeFakePath -------------------
        let removeFakePath = function(path){
            // console.log('removeFakePath', path);
            let parts = path.split("\\");
            // console.log (parts, parts[2]);
            return parts[2];
        }
         // ----------------------------- submitData ----------------------------
         // Called when Submit button is pressed.
         // Consolidate panoFinal, object that will be converted to json and sent to server.
         // Check data for errors.
         // Submit verified data to server.
         let submitData = function() {
            console.log('submitData');
            // object list of all the project data that will be saved to the json file.
            let projectData = {
                projectName:{ id:"#projectName", value: document.querySelector('#projectName').value, type:"string" },
                authorName:{ id:"#authorName", value: document.querySelector('#authorName').value, type:"string" }, 
                // bNumbersVisible:{ id:"#numbers_vis", value: document.querySelector('#numbers_vis').click, type:"boolean" },
                // bNamesVisible:{ id:"#names_vis", value: document.querySelector('#names_vis').click, type:"boolean" }, 
                // bNumVisRollover:{ id:"#num_over", value: document.querySelector('#num_over').click, type:"boolean" } , 
                // bNamVisRollover:{ id:"#names_over", value: document.querySelector('#names_over').click, type:"boolean" },
                // firstPanoNum:{ id:"#first_pano", value: document.querySelector('#first_pano').value, type: "number" }, 
                // firstTargetNum:{ id:"#first_target", value: document.querySelector('#first_target').value, type: "number" }, 
                // bThumbnailsVisible:{ id:"#thumbnails_vis", value: document.querySelector('#thumbnails_vis').click, type: "boolean" }, 
                // bThumbNamesVisible:{ id:"#thm_names_vis", value: document.querySelector('#thm_names_vis').click, type: "boolean" }, 
                // bThumbNumbersVisible:{ id:"#thm_numbers_vis", value: document.querySelector('#thm_numbers_vis').click, type: "boolean" },
                // bLogoVisible:{ id:"#logo_vis", value: document.querySelector('#logo_vis').click, type:"boolean" }, 
                // logoFile:{ id:"#logo_input_file", value: document.querySelector('#logo_vis').value, type: "file"},
                // bLogoFixed:{ id:"#logo_fixed", value: document.querySelector('#logo_fixed').click, type:"boolean" }, 
                // logoDuration:{ id:"#logo_duration", value: document.querySelector('#logo_duration').value, type:"number" }, 
                // bUseCamPostionData:{ id:"#use_cam_pos_data", value: document.querySelector('#use_cam_pos_data').click, type:"boolean" }
            };


            // Save all html fields to the project Data Object. Test all the open fields for invalid entries.
            // let projectFieldsValid = true;
            // let projectDataKeys = Object.keys(projectData);
            // for (const key of projectDataKeys) {
            //     // console.log(key, projectData[key].type );
            //     if (projectData[key].type == "string" ){
            //         if (isFieldValid(projectData[key].id)){
            //             projectData[key].value = document.querySelector(projectData[key].id).value;
            //         }  else { projectFieldsValid = false; }
            //     }
            //     if (projectData[key].type == "number" ){
            //         if (isFieldValid(projectData[key].id)){
            //             let num = (document.querySelector(projectData[key].id).value);
            //             if (num){  projectData[key].value = num; }
            //         }  else { projectFieldsValid = false; }
            //     }
            //     if (projectData[key].type == "boolean" ){    
            //         projectData[key].value = document.querySelector(projectData[key].id).checked.toString();
            //     }
            //     if (projectData[key].type == "file" ){  
            //         let file =   document.querySelector(projectData[key].id).value;
            //         if (file){
            //             file = removeFakePath(file);
            //         } else { file = null; }
            //         projectData[key].value = file;
            //     }
               
           

            // Retrieve data from pano html fields and populate gPanos object.
            populatePanoValues(); 
           // Create values object that will be passed into json file. 
           // Start by getting verified array of pano data.
            // let values = checkPanoValues();
            // values = {};

            // Add the project data.
            let projectDataObject = {};
            projectDataKeys = Object.keys(projectData);
            // console.log('projectDataKeys', projectDataKeys);
            for (const key of projectDataKeys) {
                if ( projectData[key].value){
                    projectDataObject[key] = projectData[key].value;
                }
            }     
           
            // console.log('values', values);
            // console.log('gPanos', gPanos);
            if ( values && projectFieldsValid ){
                panoFinal = {}; // Object to be sent to server
                
                // Add the pano data.               
                panoFinal['data'] = { panos: values, project: projectDataObject };
                 console.log('panoFinal', panoFinal);
                // prepare to send json to server
                const options = {
                    method: 'POST',
                    headers:{ 'Content_Type': 'application/json' },
                    body: JSON.stringify(panoFinal)
                };
                console.log('options', options);
                // submit data to the server.               
                async function getApi(){ // async function uses await for response.
                    console.log('getApi');
                    const response = await fetch('/api', options ); // first promise received
                    const data =  await response.json(); // processing json triggers seconde promise
                    // Open panomaker in new tab.
                    console.log("response: ", data);
                }
                getApi();
            } else {
                alert('Some fields were left blank. Please attend to the highlighted areas.');
                return;
            }
        }
        // ----------------------------- importCamData ----------------------------
        function importCamData(files){
            console.log('import camera data ', files.length, files)

            if (window.File && window.FileReader && window.FileList && window.Blob){
                console.log('File Reader available')
                let jsonFile = files[0]
                console.log('jsonFile', jsonFile)
                const reader = new FileReader()
              
                reader.addEventListener('load', function(){  
                    const camObjects = JSON.parse(reader.result)                  
                    console.log('loaded', camObjects)
                    const filePath = camObjects.panoPath
                    console.log('filePath ', filePath)
                   
                    // populate the panos
                    loadPano(camObjects)          

                })
                reader.readAsText(jsonFile) 
            } else {
                alert(' Cannot get save file because your browser does not support File Reader API.')
            }
        }
       
        // ----------------------------- divCreator ----------------------------
        // creates new divs appended to the body tag.
        function divCreator(id, parent){
            // console.log('divCreator', id, parent);
            let newDiv = document.createElement('div');
            let newElement = parent.appendChild(newDiv);
            newElement.setAttribute('id', id);
            return newElement;
        }
         // ----------------------------- divInserter ----------------------------
        // creates new divs appended to the body tag.
        let divInserter = function(id, parent, prevDiv){
            // console.log('divInserter', id, parent, prevDiv);
            let newDiv = document.createElement('div');
            let newElement = parent.insertBefore(newDiv, prevDiv);
            newElement.setAttribute('id', id);
            return newElement;
        }
          // ----------------------------- extractId ----------------------------
        // extract the Id number at the end of the string inside panoId
        function extractId(panoId){
            if (!panoId){ panoId = gCurPano }
            // console.log('checkInput panoId:', panoId)
            let pId = panoId.toString().match(/\d+/)[0]
            if(!pId){pId=gCurPano}
            pId = Number(pId)
            return pId
        } 
        
   
    //  ----------------------------- MAIN ----------------------------    

      // Global Variables
      let gPanos = [];// List of all the panos to be used
      let gCurPano = 0;
      let gbvaluesValid = false; 
    //   const reader = new FileReader()
    //   const inputCamData = document.querySelector('#import_button')
    //   inputCamData.addEventListener('change', imputCameraData())
    createPano(0) 
