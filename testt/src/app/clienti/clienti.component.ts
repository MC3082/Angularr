import { Component, OnInit } from '@angular/core';
import { Client, ClientService } from '../client.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';






@Component({
  selector: 'app-clienti',
  templateUrl: './clienti.component.html',
  styleUrl: './clienti.component.css'
})
export class ClientiComponent implements OnInit {

  clienti: Client[]=[];
  displayedColumns: string[] = ['id','nome', 'cognome', 'email', 'edit', 'delete'];
  userform: FormGroup;
  selectedClientId: number | null=null;
  constructor(private clientservice: ClientService, private fb: FormBuilder) {
    this.userform = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]

    });
   }
  ngOnInit(): void {
    this.getClient();
    
    
    }
    getClient(): void{
      let id= sessionStorage.getItem('userId');
    this.clientservice.getClientsById(parseInt(id as string)).subscribe({
      next: (clienti) => {
        this.clienti = clienti;
      },
      error: (err) => console.error('Errore nel recupero dei clienti', err)
    });
    }
  onSubmit(): void{
    if(this.userform.valid){
      if(this.selectedClientId=== null){
          let id= sessionStorage.getItem('userId');
          const cliente = {...this.userform.value, userid:id};
          this.clientservice.addClient(cliente).subscribe({
            next: (response) => {
              this.getClient();
            },
            error: (error) =>{
              console.error('Errore durante l aggiunta del cliente', error);
            }
          });
        } else {
          let userid = sessionStorage.getItem('userId');
          const cliente = {...this.userform.value, userid: userid, id:this.selectedClientId};
          console.log(cliente);
          this.clientservice.updateClient(cliente).subscribe({
            next: (response) => {
              this.getClient();
              this.selectedClientId = null;
            },
            error: (error) =>{
              console.error('Errore durante l aggiunta del cliente', error);
            }
          });
        }
    }    


    
  }

  onEdit(client: Client): void{
    this.userform.patchValue({
      nome: client.nome,
      cognome: client.cognome,
      email: client.email

    });
    this.selectedClientId = client.id !== undefined ? client.id : null;
  }

onDelete(clientId: number): void{
  this.clientservice.deleteClient(clientId).subscribe(() => {
  this.clienti = this.clienti.filter(cliente => cliente.id!== clientId);
  });

} 
} 
