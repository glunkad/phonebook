package com.example.backend.repo;

import com.example.backend.model.Phonebook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhonebookRepo extends JpaRepository<Phonebook, Long> {
}
