package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="people")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class Phonebook {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private  String number;

}
