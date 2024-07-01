import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";
import { hash } from "bcrypt";


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

  @BeforeInsert()
  async hasPassword(){
    this.password = await hash(this.password, Number(process.env.HASH_SALT))
  }

}