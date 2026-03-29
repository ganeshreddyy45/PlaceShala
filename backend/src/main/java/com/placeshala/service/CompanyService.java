package com.placeshala.service;

import com.placeshala.entity.Company;
import com.placeshala.exception.ResourceNotFoundException;
import com.placeshala.repository.CompanyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public Company createCompany(Company company) {
        return companyRepository.save(company);
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
    }

    public Company updateCompany(Long id, Company updated) {
        Company existing = getCompanyById(id);
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getIndustry() != null) existing.setIndustry(updated.getIndustry());
        if (updated.getLocation() != null) existing.setLocation(updated.getLocation());
        if (updated.getWebsite() != null) existing.setWebsite(updated.getWebsite());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getLogoUrl() != null) existing.setLogoUrl(updated.getLogoUrl());
        return companyRepository.save(existing);
    }

    public void deleteCompany(Long id) {
        if (!companyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Company not found with id: " + id);
        }
        companyRepository.deleteById(id);
    }
}
