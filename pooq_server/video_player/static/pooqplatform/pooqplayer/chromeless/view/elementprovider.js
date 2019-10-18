class ElementProvider
{
	constructor(body,id="") 
	{
  		id = id=="" ? jarvis.lib.generateID("ElementProvider") : id;
        this.body = body;
        this.id = id;
    }

    init()
    {
       
    }
    remove()
    {
        this.body.innerHTML = "";
    }
    writeHTML()
    {
        
        
    }
    getElement(id)
    {
        id = this.id+id;
        return document.getElementById(id);
    }


}