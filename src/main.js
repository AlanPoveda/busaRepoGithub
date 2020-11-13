import api from './api'


class App {
    constructor(){
        this.repositories = [];

        this.formEl = document.getElementById('repo-form');
        this.inputEl = document.querySelector('input[name=repository]');
        this.listEl = document.getElementById('repo-list');
        
        this.registerHandlers();
    }
    registerHandlers() {
        this.formEl.onsubmit = event => this.addRepository(event);
    }

    setLoading(loading = true){
        if (loading === true){
            let loadingEl = document.createElement('span');
            loadingEl.appendChild(document.createTextNode('Carregando'));
            loadingEl.setAttribute('id','loading');

            this.formEl.appendChild(loadingEl);

        }else {
            document.getElementById('loading').remove();
        }

    }

    async addRepository(event) {
        event.preventDefault();

        const repoInput = this.inputEl.value;

        if(repoInput === 0 )
            return;
        
        this.setLoading();

        try {
            const response = await api.get(`/users/${repoInput}/repos`);

            // Pegando imagem pessoal
            const { owner: { avatar_url }} = response.data[0]


            this.repositories.push({
                //Pushar o nome do User
                name: `${repoInput}`,
                //Foto Perfil
                avatar_url,
                //Perfil link
                html_url: `https://github.com/${repoInput}`, 
                //Repositories do usuário
                repositories: `https://github.com/${repoInput}?tab=repositories`
                

            })
            this.inputEl.value = '';

            this.render();
        } catch (err){
            alert("Não achamos o usuário, digite novamente");
            this.inputEl.value = '';
        }

        this.setLoading(false);
    }
    render() {
         this.listEl.innerHTML = "",

         this.repositories.forEach(repo => {
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);

            let titleEl = document.createElement('strong');
            titleEl.appendChild(document.createTextNode(repo.name));

            let linkUserEl = document.createElement('a');
            linkUserEl.setAttribute('target','_blank');
            linkUserEl.setAttribute('href', repo.html_url);
            linkUserEl.appendChild(document.createTextNode('Link Perfil 🐱‍🏍'));

            let linkRepoEl = document.createElement('a');
            linkRepoEl.setAttribute('target', '_blank');
            linkRepoEl.setAttribute('href', repo.repositories);
            linkRepoEl.appendChild(document.createTextNode('Link Repositórios 🐱‍👓'))
            
            //Criação da lista
            let listItemEl = document.createElement('li');
            listItemEl.appendChild(titleEl);
            listItemEl.appendChild(imgEl);
            listItemEl.appendChild(linkUserEl);
            listItemEl.appendChild(linkRepoEl);
            

            this.listEl.appendChild(listItemEl);


         });
    }
}

new App();

