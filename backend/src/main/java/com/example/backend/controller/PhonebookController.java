package com.example.backend.controller;


import com.example.backend.model.Phonebook;
import com.example.backend.repo.PhonebookRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "/api/persons", produces = MediaType.APPLICATION_JSON_VALUE)
public class PhonebookController {

    @Autowired
    private PhonebookRepo phonebookRepo;

    @GetMapping("")
    public ResponseEntity<List<Phonebook>> getAllPersons() {
        try {
            List<Phonebook> phonebookList = new ArrayList<>();
            phonebookRepo.findAll().forEach(phonebookList::add);

            if(phonebookList.isEmpty()){
                return new ResponseEntity<>( HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(phonebookList,HttpStatus.OK);
        }catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Phonebook> getPersonById(@PathVariable Long id) {
        try {

            Optional<Phonebook> phonebookData = phonebookRepo.findById(id);

            if(phonebookData.isPresent()){
                return new ResponseEntity<>(phonebookData.get(),HttpStatus.OK);
            }

            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("")
    public ResponseEntity<Phonebook> addPerson(@RequestBody Phonebook phonebook) {
        try{
            Phonebook phonebookObj = phonebookRepo.save(phonebook);

            return new ResponseEntity<>(phonebookObj, HttpStatus.OK );
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}")
    public ResponseEntity<Phonebook> updatePersonById(@PathVariable Long id, @RequestBody Phonebook newPhonebookData) {
        try{
            Optional<Phonebook> oldPhonebookData = phonebookRepo.findById(id);

            if(oldPhonebookData.isPresent()) {
                Phonebook updatePhonebookData = oldPhonebookData.get();
                updatePhonebookData.setName(newPhonebookData.getName());
                updatePhonebookData.setNumber(newPhonebookData.getNumber());

                Phonebook phonebookObj =  phonebookRepo.save(updatePhonebookData);
                return new ResponseEntity<>(phonebookObj, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        catch (Exception ex){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Phonebook> deletePersonById(@PathVariable Long id) {
        try {
            phonebookRepo.deleteById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
