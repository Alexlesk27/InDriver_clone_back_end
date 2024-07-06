import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToMany, JoinTable } from "typeorm";
import { hash } from "bcrypt";
import { Rol } from "src/roles/rol.entity";


@Entity({name: 'users'})
export class User{
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true})
  name: String;

  @Column({ nullable: true, })
  lastName: String;

  @Column({unique: true })
  email: String;

  @Column({unique: true})
  phone: String;

  @Column({nullable: true, default: null})
  image: String;

  @Column({nullable: true})
  password: String;

  @Column({nullable: true, default: null})
  notification_token: String;


  @Column({type: 'datetime', default: ()=>'CURRENT_TIMESTAMP'})
  created_at: Date;

  @Column({type: 'datetime', default: ()=>'CURRENT_TIMESTAMP'})
  updated_at: Date;

  @JoinTable({
    name: 'user_has_roles',
    joinColumn : {
         name: 'id_user'
      },
      inverseJoinColumn:{
        name: 'id_rol'
      }
    }
  )
  @ManyToMany(() => Rol, (rol) => rol.users)
  roles: Rol[]

  @BeforeInsert()
  async hasPassword(){
    this.password = await hash(this.password, Number(process.env.HASH_SALT))
  }

}